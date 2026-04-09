// PayPal 支付 API - 创建订单

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createOrder } from '@/lib/paypal';
import { getTierById } from '@/types/membership';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tierId, billingCycle } = body as {
      tierId: string;
      billingCycle: 'monthly' | 'yearly';
    };

    // 验证会员等级
    const tier = getTierById(tierId as 'pro' | 'premium');
    if (!tier) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // 获取价格
    const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
    if (price <= 0) {
      return NextResponse.json(
        { error: 'Free tier does not require payment' },
        { status: 400 }
      );
    }

    // 获取返回 URL
    const origin = request.headers.get('origin') || process.env.AUTH_URL || 'https://fitness-plan.net';
    const returnUrl = `${origin}/api/payment/paypal/capture`;
    const cancelUrl = `${origin}/pricing?cancelled=true`;

    // 创建 PayPal 订单
    const order = await createOrder(
      price,
      tierId,
      session.user.id,
      billingCycle,
      returnUrl,
      cancelUrl
    );

    // 找到 approve URL
    const approveLink = order.links.find(link => link.rel === 'approve');
    if (!approveLink) {
      return NextResponse.json(
        { error: 'No approve link found' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      approveUrl: approveLink.href,
    });
  } catch (error) {
    console.error('PayPal create order error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}