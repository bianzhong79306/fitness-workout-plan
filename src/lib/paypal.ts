// PayPal API 工具函数

const PAYPAL_SANDBOX_API = 'https://api-m.sandbox.paypal.com';
const PAYPAL_LIVE_API = 'https://api-m.paypal.com';

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}

function getConfig(): PayPalConfig {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
  };
}

function getApiUrl(): string {
  const config = getConfig();
  return config.mode === 'sandbox' ? PAYPAL_SANDBOX_API : PAYPAL_LIVE_API;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// 缓存 token 避免频繁请求
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * 获取 PayPal OAuth2 Access Token
 */
export async function getAccessToken(): Promise<string> {
  // 检查缓存
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const config = getConfig();
  const apiUrl = getApiUrl();

  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch(`${apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[PayPal] Token error:', errorText);
    throw new Error(`Failed to get PayPal access token: ${response.status}`);
  }

  const data = await response.json() as TokenResponse;
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // 提前60秒过期

  return data.access_token;
}

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface OrderPayload {
  intent: 'CAPTURE';
  purchase_units: Array<{
    reference_id: string;
    amount: {
      currency_code: string;
      value: string;
    };
    description: string;
    custom_id?: string;
  }>;
  application_context?: {
    return_url: string;
    cancel_url: string;
    brand_name: string;
    user_action: 'PAY_NOW';
    shipping_preference: 'NO_SHIPPING';
  };
}

/**
 * 创建 PayPal 订单
 */
export async function createOrder(
  amount: number,
  tierId: string,
  userId: string,
  billingCycle: 'monthly' | 'yearly',
  returnUrl: string,
  cancelUrl: string
): Promise<PayPalOrder> {
  const accessToken = await getAccessToken();
  const apiUrl = getApiUrl();

  // 创建唯一的 reference_id 用于追踪订单
  const referenceId = `${tierId}_${userId}_${billingCycle}_${Date.now()}`;

  const tierNames: Record<string, { en: string; zh: string }> = {
    pro: { en: 'Pro Membership', zh: 'Pro会员' },
  };

  const tierName = tierNames[tierId] || { en: tierId, zh: tierId };
  const cycleText = billingCycle === 'monthly' ? 'Monthly' : 'Yearly (Save 20%)';

  const payload: OrderPayload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: referenceId,
        custom_id: referenceId,
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2),
        },
        description: `FitPlan Pro ${tierName.en} - ${cycleText}`,
      },
    ],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      brand_name: 'FitPlan Pro',
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING',
    },
  };

  const response = await fetch(`${apiUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': referenceId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[PayPal] Create order error:', errorText);
    throw new Error(`Failed to create PayPal order: ${response.status}`);
  }

  return await response.json() as PayPalOrder;
}

export interface CaptureResult {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

/**
 * 捕获/完成 PayPal 订单支付
 */
export async function captureOrder(orderId: string): Promise<CaptureResult> {
  const accessToken = await getAccessToken();
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[PayPal] Capture order error:', errorText);
    throw new Error(`Failed to capture PayPal order: ${response.status}`);
  }

  return await response.json() as CaptureResult;
}

/**
 * 解析 reference_id 获取订单信息
 * 格式: tierId_userId_billingCycle_timestamp
 */
export function parseReferenceId(referenceId: string): {
  tierId: string;
  userId: string;
  billingCycle: 'monthly' | 'yearly';
} | null {
  const parts = referenceId.split('_');
  if (parts.length < 4) return null;

  const tierId = parts[0];
  const userId = parts[1];
  const billingCycle = parts[2] as 'monthly' | 'yearly';

  // 验证 billingCycle
  if (billingCycle !== 'monthly' && billingCycle !== 'yearly') {
    return null;
  }

  return { tierId, userId, billingCycle };
}

/**
 * 计算会员到期时间
 */
export function calculateExpiryDate(billingCycle: 'monthly' | 'yearly'): string {
  const now = new Date();
  if (billingCycle === 'monthly') {
    now.setMonth(now.getMonth() + 1);
  } else {
    now.setFullYear(now.getFullYear() + 1);
  }
  return now.toISOString();
}

/**
 * 获取 PayPal SDK URL（用于前端加载）
 */
export function getPayPalSdkUrl(): string {
  const config = getConfig();
  const baseUrl = config.mode === 'sandbox'
    ? 'https://www.sandbox.paypal.com'
    : 'https://www.paypal.com';
  return `${baseUrl}/sdk/js?client-id=${config.clientId}&currency=USD&intent=capture`;
}