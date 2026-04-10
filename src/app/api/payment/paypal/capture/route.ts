// PayPal 支付 API - 捕获支付并更新会员状态

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { captureOrder, parseReferenceId, calculateExpiryDate } from '@/lib/paypal';
import { updateUserTier, createSubscription } from '@/lib/membership';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('token') || searchParams.get('order_id');
    const payerId = searchParams.get('PayerID');

    if (!orderId) {
      return NextResponse.redirect(
        new URL('/pricing?error=no_order', request.headers.get('origin') || 'https://fitness-plan.net')
      );
    }

    // 捕获支付
    const captureResult = await captureOrder(orderId);

    // 检查支付状态
    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.redirect(
        new URL(`/pricing?error=payment_failed&status=${captureResult.status}`, request.headers.get('origin') || 'https://fitness-plan.net')
      );
    }

    // 获取订单信息
    const referenceId = captureResult.purchase_units[0]?.reference_id;
    if (!referenceId) {
      return NextResponse.redirect(
        new URL('/pricing?error=no_reference', request.headers.get('origin') || 'https://fitness-plan.net')
      );
    }

    // 解析订单信息
    const orderInfo = parseReferenceId(referenceId);
    if (!orderInfo) {
      return NextResponse.redirect(
        new URL('/pricing?error=invalid_reference', request.headers.get('origin') || 'https://fitness-plan.net')
      );
    }

    // 获取数据库
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.redirect(
        new URL('/pricing?error=no_database', request.headers.get('origin') || 'https://fitness-plan.net')
      );
    }

    // 更新会员状态
    const expiresAt = calculateExpiryDate(orderInfo.billingCycle);

    // 创建订阅记录
    const subscription = await createSubscription(db, {
      userId: orderInfo.userId,
      tierId: orderInfo.tierId as 'pro',
      status: 'active',
      startedAt: new Date().toISOString(),
      expiresAt,
    });

    // 更新用户会员等级
    await updateUserTier(db, orderInfo.userId, orderInfo.tierId as 'pro');

    // 存储 capture_id 用于退款追踪
    const captureId = captureResult.purchase_units[0]?.payments?.captures?.[0]?.id;
    if (captureId) {
      await db
        .prepare(`
          INSERT INTO payment_records (id, user_id, capture_id, order_id, reference_id, tier_id, amount, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          crypto.randomUUID(),
          orderInfo.userId,
          captureId,
          orderId,
          referenceId,
          orderInfo.tierId,
          captureResult.purchase_units[0]?.payments?.captures?.[0]?.amount?.value || '0',
          'completed',
          new Date().toISOString()
        )
        .run()
        .catch(() => {
          // 如果表不存在，忽略错误（后续迁移会创建表）
          console.log('[Capture] payment_records table not found, skipping record');
        });
    }

    // 重定向到成功页面
    return NextResponse.redirect(
      new URL(`/pricing?success=true&tier=${orderInfo.tierId}`, request.headers.get('origin') || 'https://fitness-plan.net')
    );
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.redirect(
      new URL(`/pricing?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.headers.get('origin') || 'https://fitness-plan.net')
    );
  }
}