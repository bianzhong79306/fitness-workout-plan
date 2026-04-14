// 会员定价页面客户端组件

'use client';

import { useState, useEffect } from 'react';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { MembershipTier, TierFeature, TierLimits } from '@/types/membership';

// 简化的会员等级类型用于显示
interface DisplayTier extends Omit<MembershipTier, 'limits'> {
  limits: TierLimits;
}

export default function PricingPageClient({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tiers, setTiers] = useState<DisplayTier[]>([]);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [payingTier, setPayingTier] = useState<string | null>(null);

  // 处理支付结果
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const newTier = searchParams.get('tier');

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取会员等级配置
        const tiersRes = await fetch('/api/membership/tiers');
        const tiersData = await tiersRes.json() as { tiers?: DisplayTier[] };
        setTiers(tiersData.tiers || []);

        // 获取用户当前会员等级
        if (session?.user?.id) {
          const userRes = await fetch('/api/membership/user');
          const userData = await userRes.json() as { tier?: string };
          setCurrentTier(userData.tier || 'free');
        }
      } catch (error) {
        console.error('Failed to fetch pricing data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, success]);

  const handlePayment = async (tierId: string) => {
    if (!session?.user) {
      router.push(`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/pricing`)}`);
      return;
    }

    setPayingTier(tierId);

    try {
      // 调用后端创建 PayPal 订单
      const response = await fetch('/api/payment/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, billingCycle }),
      });

      const data = await response.json() as { error?: string; approveUrl?: string; orderId?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // 跳转到 PayPal 授权页面
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed');
      setPayingTier(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 活力Hero区域 */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
        {/* 光晕装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-300/30 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">{locale === 'zh' ? "解锁全部功能" : "Unlock All Features"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            {locale === 'zh' ? '选择适合你的会员计划' : 'Choose Your Membership Plan'}
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'zh' ? '开启你的智能健身之旅' : 'Start your smart fitness journey'}
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              className={billingCycle === 'monthly' ? "bg-white text-orange-600 rounded-full font-semibold" : "bg-white/10 text-white border-white/40 rounded-full"}
              onClick={() => setBillingCycle('monthly')}
            >
              {locale === 'zh' ? '按月付费' : 'Monthly'}
            </Button>
            <Button
              className={billingCycle === 'yearly' ? "bg-white text-orange-600 rounded-full font-semibold" : "bg-white/10 text-white border-white/40 rounded-full"}
              onClick={() => setBillingCycle('yearly')}
            >
              {locale === 'zh' ? '按年付费' : 'Yearly'}
              <Badge className="ml-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full">{locale === 'zh' ? '省20%' : 'Save 20%'}</Badge>
            </Button>
          </div>
        </div>
      </section>
      
      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-16">

      {/* Payment Result Alert */}
      {success && (
        <Alert className="max-w-2xl mx-auto mb-8 border-green-500 bg-green-50">
          <AlertDescription className="text-green-700">
            {locale === 'zh'
              ? `🎉 恭喜！您已成功升级到 Pro 会员！`
              : `🎉 Congratulations! You've successfully upgraded to Pro membership!`}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="max-w-2xl mx-auto mb-8 border-red-500 bg-red-50">
          <AlertDescription className="text-red-700">
            {locale === 'zh'
              ? `支付失败：${error}`
              : `Payment failed: ${error}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tiers.map((tier) => {
          const isCurrentTier = currentTier === tier.id;
          const isRecommended = tier.id === 'pro';
          const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
          const isPaying = payingTier === tier.id;

          return (
            <Card
              key={tier.id}
              className={`relative border-2 overflow-hidden ${isRecommended ? 'border-orange-500 shadow-xl scale-105 bg-gradient-to-br from-orange-50 to-amber-50' : 'border-slate-200'} ${isCurrentTier ? 'ring-2 ring-orange-500' : ''}`}
            >
              {/* 渐变顶部装饰 */}
              <div className={`h-3 ${isRecommended ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500' : 'bg-gradient-to-r from-slate-300 to-slate-400'}`} />
              
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full px-4">
                    <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                    {locale === 'zh' ? '推荐' : 'Recommended'}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold">
                  {locale === 'zh' ? tier.nameZh : tier.name}
                </CardTitle>
                <CardDescription>
                  <div className="text-5xl font-black mt-4">
                    {price === 0
                      ? (locale === 'zh' ? '免费' : 'Free')
                      : `$${price.toFixed(2)}`
                    }
                  </div>
                  {price > 0 && (
                    <div className="text-sm text-slate-500 mt-1">
                      {billingCycle === 'monthly'
                        ? (locale === 'zh' ? '/月' : '/month')
                        : (locale === 'zh' ? '/年' : '/year')
                      }
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {tier.features.map((feature: TierFeature) => (
                  <div key={feature.key} className={`flex items-center gap-2 p-2 rounded-lg ${feature.included ? 'bg-green-50' : 'bg-slate-50'}`}>
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-slate-400" />
                    )}
                    <span className={feature.included ? 'font-medium' : 'text-slate-400'}>
                      {locale === 'zh' ? feature.nameZh : feature.name}
                    </span>
                    {feature.highlight && feature.included && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full ml-auto">
                        {locale === 'zh' ? '热门' : 'Popular'}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-6">
                {isCurrentTier ? (
                  <Button variant="outline" className="w-full rounded-full" disabled>
                    {locale === 'zh' ? '当前计划' : 'Current Plan'}
                  </Button>
                ) : price === 0 ? (
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-2"
                    onClick={() => router.push(`/${locale}/auth/signin`)}
                    disabled={!session?.user}
                  >
                    {locale === 'zh' ? '免费开始' : 'Get Started'}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg"
                    onClick={() => handlePayment(tier.id)}
                    disabled={isPaying || !session?.user}
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {locale === 'zh' ? '处理中...' : 'Processing...'}
                      </>
                    ) : (
                      locale === 'zh' ? '立即升级' : 'Upgrade Now'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ or additional info */}
      <div className="max-w-2xl mx-auto mt-12 p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
        <p className="text-center">
          {locale === 'zh'
            ? '所有计划都包含基础训练计划、计时器和进度追踪功能'
            : 'All plans include basic workout plans, timer, and progress tracking'}
        </p>
        <p className="text-center text-sm mt-2">
          {locale === 'zh'
            ? '支付通过 PayPal 安全处理，支持信用卡、银行卡等多种方式'
            : 'Payments securely processed via PayPal, supports credit cards and more'}
        </p>
      </div>
      </div>
    </div>
  );
}