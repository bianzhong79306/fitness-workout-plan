// 会员定价页面客户端组件

'use client';

import { useState, useEffect } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MembershipTier, TierFeature, TierLimits } from '@/types/membership';

// 简化的会员等级类型用于显示
interface DisplayTier extends Omit<MembershipTier, 'limits'> {
  limits: TierLimits;
}

export default function PricingPageClient({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('pricing');
  const [tiers, setTiers] = useState<DisplayTier[]>([]);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
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
  }, [session]);
  
  const handleUpgrade = (tierId: string) => {
    if (!session?.user) {
      router.push(`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/pricing`)}`);
      return;
    }
    // TODO: 实际支付流程待后续实现
    alert(`即将升级到 ${tierId} 会员，支付功能开发中...`);
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
    <div className="container mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {locale === 'zh' ? '选择适合你的会员计划' : 'Choose Your Membership Plan'}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {locale === 'zh' 
            ? '开启你的智能健身之旅' 
            : 'Start your smart fitness journey'}
        </p>
        
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('monthly')}
          >
            {locale === 'zh' ? '按月付费' : 'Monthly'}
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('yearly')}
          >
            {locale === 'zh' ? '按年付费' : 'Yearly'}
            <Badge variant="secondary" className="ml-2">
              {locale === 'zh' ? '省20%' : 'Save 20%'}
            </Badge>
          </Button>
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => {
          const isCurrentTier = currentTier === tier.id;
          const isRecommended = tier.id === 'pro';
          const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
          
          return (
            <Card 
              key={tier.id}
              className={`relative ${isRecommended ? 'border-primary shadow-lg scale-105' : ''} ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {locale === 'zh' ? '推荐' : 'Recommended'}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {locale === 'zh' ? tier.nameZh : tier.name}
                </CardTitle>
                <CardDescription>
                  <div className="text-4xl font-bold text-foreground">
                    {price === 0 
                      ? (locale === 'zh' ? '免费' : 'Free')
                      : `$${price.toFixed(2)}`
                    }
                  </div>
                  {price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {billingCycle === 'monthly' 
                        ? (locale === 'zh' ? '/月' : '/month')
                        : (locale === 'zh' ? '/年' : '/year')
                      }
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {tier.features.map((feature: TierFeature) => (
                  <div key={feature.key} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground'}>
                      {locale === 'zh' ? feature.nameZh : feature.name}
                    </span>
                    {feature.highlight && feature.included && (
                      <Badge variant="outline" className="text-xs">
                        {locale === 'zh' ? '热门' : 'Popular'}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                {isCurrentTier ? (
                  <Button variant="outline" className="w-full" disabled>
                    {locale === 'zh' ? '当前计划' : 'Current Plan'}
                  </Button>
                ) : price === 0 ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={!session?.user}
                  >
                    {locale === 'zh' ? '免费开始' : 'Get Started'}
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => handleUpgrade(tier.id)}
                  >
                    {locale === 'zh' ? '立即升级' : 'Upgrade Now'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* FAQ or additional info */}
      <div className="text-center mt-12 text-muted-foreground">
        <p>
          {locale === 'zh' 
            ? '所有计划都包含基础训练计划、计时器和进度追踪功能'
            : 'All plans include basic workout plans, timer, and progress tracking'}
        </p>
      </div>
    </div>
  );
}