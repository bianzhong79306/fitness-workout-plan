// PayPal Webhook 接收支付事件通知

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { parseReferenceId } from '@/lib/paypal';
import { updateUserTier, cancelSubscription } from '@/lib/membership';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// PayPal Webhook 事件类型
const WEBHOOK_EVENTS = {
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  PAYMENT_CAPTURE_REVERSED: 'PAYMENT.CAPTURE.REVERSED',
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
      case WEBHOOK_EVENTS.PAYMENT_CAPTURE_REVERSED:
        // 退款或撤销 - 需要处理会员降级
        console.log('[Webhook] Payment refunded/reversed:', event.event_type, event.resource?.id);
        await handleRefund(db, event.resource, event.event_type);
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
async function handleRefund(db: D1Database, refundResource: any, eventType: string) {
  try {
    // 获取原始捕获ID
    // PayPal退款事件中，links中rel='up'的链接指向原始捕获
    let originalCaptureId = refundResource?.links?.find(
      (link: any) => link.rel === 'up'
    )?.href?.split('/').pop();

    // 或者直接从resource中获取
    if (!originalCaptureId) {
      originalCaptureId = refundResource?.id;
    }

    if (!originalCaptureId) {
      console.error('[Webhook] Cannot find original capture ID for refund');
      return;
    }

    console.log('[Webhook] Processing refund for capture:', originalCaptureId);

    // 查找支付记录
    const paymentRecord = await db
      .prepare('SELECT * FROM payment_records WHERE capture_id = ? AND status = "completed"')
      .bind(originalCaptureId)
      .first<{
        id: string;
        user_id: string;
        tier_id: string;
        reference_id: string;
      }>();

    if (!paymentRecord) {
      console.log('[Webhook] No payment record found for capture:', originalCaptureId);

      // 尝试从reference_id解析（作为备选方案）
      // PayPal订单可能包含custom_id或reference_id
      const customId = refundResource?.custom_id || refundResource?.invoice_id;
      if (customId) {
        const orderInfo = parseReferenceId(customId);
        if (orderInfo) {
          await downgradeMembership(db, orderInfo.userId, originalCaptureId);
        }
      }
      return;
    }

    // 降级会员
    await downgradeMembership(db, paymentRecord.user_id, originalCaptureId);

    // 更新支付记录状态
    await db
      .prepare('UPDATE payment_records SET status = "refunded", refunded_at = ? WHERE id = ?')
      .bind(new Date().toISOString(), paymentRecord.id)
      .run();

    console.log('[Webhook] Successfully processed refund for user:', paymentRecord.user_id);
  } catch (error) {
    console.error('[Webhook] Refund handling error:', error);
  }
}

// 降级会员到free
async function downgradeMembership(db: D1Database, userId: string, captureId: string) {
  try {
    // 1. 取消用户的活跃订阅
    const activeSub = await db
      .prepare(`
        SELECT id FROM user_subscriptions
        WHERE user_id = ? AND status = 'active'
        ORDER BY created_at DESC LIMIT 1
      `)
      .bind(userId)
      .first<{ id: string }>();

    if (activeSub) {
      await cancelSubscription(db, activeSub.id);
      console.log('[Webhook] Cancelled subscription:', activeSub.id);
    }

    // 2. 降级用户会员等级到free
    await updateUserTier(db, userId, 'free');
    console.log('[Webhook] Downgraded user to free:', userId);

    // 3. 记录日志（可选：发送通知邮件）
    console.log('[Webhook] Membership downgrade completed for user:', userId, 'capture:', captureId);
  } catch (error) {
    console.error('[Webhook] Failed to downgrade membership:', error);
    throw error;
  }
}

// GET 用于验证 webhook（PayPal 会发送验证请求）
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'PayPal webhook endpoint is active',
  });
}