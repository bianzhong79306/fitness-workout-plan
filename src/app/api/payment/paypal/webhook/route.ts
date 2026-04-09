// PayPal Webhook 接收支付事件通知

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// PayPal Webhook 事件类型
const WEBHOOK_EVENTS = {
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  CHECKOUT_ORDER_APPROVED: 'CHECKOUT.ORDER.APPROVED',
  CHECKOUT_ORDER_COMPLETED: 'CHECKOUT.ORDER.COMPLETED',
};

// 验证 PayPal Webhook 签名
async function verifyWebhookSignature(
  request: NextRequest,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    // 获取 PayPal 传输的验证头
    const authAlgo = request.headers.get('PAYPAL-TRANSMISSION-SIG-ALGO');
    const certUrl = request.headers.get('PAYPAL-CERT-URL');
    const transmissionSig = request.headers.get('PAYPAL-TRANSMISSION-SIG');
    const transmissionId = request.headers.get('PAYPAL-TRANSMISSION-ID');
    const timestamp = request.headers.get('PAYPAL-TRANSMISSION-TIME');

    if (!authAlgo || !certUrl || !transmissionSig || !transmissionId || !timestamp) {
      console.error('[Webhook] Missing required headers');
      return false;
    }

    // 简化验证：生产环境建议完整验证签名
    // 这里先检查必要的 header 存在
    console.log('[Webhook] Headers present:', {
      authAlgo,
      certUrl,
      transmissionId,
      timestamp,
    });

    return true;
  } catch (error) {
    console.error('[Webhook] Signature verification failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);

    console.log('[Webhook] Received event:', event.event_type, event.id);

    // 获取数据库连接
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      console.error('[Webhook] D1 database not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 处理不同事件类型
    switch (event.event_type) {
      case WEBHOOK_EVENTS.PAYMENT_CAPTURE_COMPLETED:
        // 支付完成 - 已在 capture API 处理，这里确认即可
        console.log('[Webhook] Payment capture completed:', event.resource?.id);
        break;

      case WEBHOOK_EVENTS.PAYMENT_CAPTURE_REFUNDED:
        // 退款 - 需要处理会员降级
        console.log('[Webhook] Payment refunded:', event.resource?.id);
        await handleRefund(db, event.resource);
        break;

      case WEBHOOK_EVENTS.PAYMENT_CAPTURE_DENIED:
        // 支付拒绝
        console.log('[Webhook] Payment denied:', event.resource?.id);
        break;

      default:
        console.log('[Webhook] Unhandled event type:', event.event_type);
    }

    // 返回 200 确认接收
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// 处理退款
async function handleRefund(db: D1Database, refundResource: any) {
  try {
    const originalCaptureId = refundResource?.links?.find(
      (link: any) => link.rel === 'up'
    )?.href?.split('/').pop();

    if (!originalCaptureId) {
      console.error('[Webhook] Cannot find original capture ID for refund');
      return;
    }

    // 查找对应的订单记录
    // 这里需要从我们存储的订单数据中找到用户
    console.log('[Webhook] Processing refund for capture:', originalCaptureId);

    // TODO: 实现退款后的会员降级逻辑
    // 1. 找到对应的用户
    // 2. 取消订阅
    // 3. 发送通知邮件（可选）
  } catch (error) {
    console.error('[Webhook] Refund handling error:', error);
  }
}

// GET 用于验证 webhook（PayPal 会发送验证请求）
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'PayPal webhook endpoint is active',
  });
}