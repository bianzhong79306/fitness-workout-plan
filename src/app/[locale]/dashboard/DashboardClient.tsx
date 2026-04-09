'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface MembershipInfo {
  tier: 'free' | 'pro' | 'premium';
  subscription: {
    tierId: string;
    status: string;
    startedAt: string;
    expiresAt: string | null;
  } | null;
}

const tierNames = {
  free: { en: 'Free', zh: '免费会员' },
  pro: { en: 'Pro', zh: '专业会员' },
  premium: { en: 'Premium', zh: '高级会员' },
};

const tierColors = {
  free: 'bg-gray-100 text-gray-800',
  pro: 'bg-blue-100 text-blue-800',
  premium: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
};

export function MembershipCard({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const isZh = locale === 'zh';

  useEffect(() => {
    if (session?.user) {
      fetch('/api/membership/user')
        .then(res => res.json())
        .then((data) => {
          setMembership(data as MembershipInfo);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tier = membership?.tier || 'free';
  const subscription = membership?.subscription;
  const tierName = isZh ? tierNames[tier].zh : tierNames[tier].en;

  // 格式化日期
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return isZh ? '永久有效' : 'Lifetime';
    const date = new Date(dateStr);
    return date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 计算剩余天数
  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const expires = new Date(expiresAt);
    const now = new Date();
    const days = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysRemaining = subscription ? getDaysRemaining(subscription.expiresAt) : null;
  const isLifetime = !subscription?.expiresAt || (subscription?.expiresAt && new Date(subscription.expiresAt).getFullYear() > 2090);

  return (
    <Card className={`mb-6 ${tier === 'premium' ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50' : tier === 'pro' ? 'border-blue-300 bg-blue-50/50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className={`h-5 w-5 ${tier === 'premium' ? 'text-purple-600' : tier === 'pro' ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>{isZh ? '会员信息' : 'Membership'}</span>
          </div>
          <Badge className={tierColors[tier]}>
            {tierName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tier === 'free' ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              {isZh
                ? '升级会员，解锁更多功能'
                : 'Upgrade to unlock more features'}
            </p>
            <Link href={`/${locale}/pricing`}>
              <Button className="gap-2">
                {isZh ? '查看会员方案' : 'View Plans'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 会员状态 */}
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isZh ? '状态' : 'Status'}
                </p>
                <p className="font-medium text-green-600">
                  {isZh ? '已激活' : 'Active'}
                </p>
              </div>
            </div>

            {/* 开始时间 */}
            {subscription?.startedAt && (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isZh ? '开始时间' : 'Started'}
                  </p>
                  <p className="font-medium">
                    {formatDate(subscription.startedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* 到期时间 */}
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isZh ? '到期时间' : 'Expires'}
                </p>
                <p className="font-medium">
                  {formatDate(subscription?.expiresAt)}
                </p>
                {!isLifetime && daysRemaining !== null && (
                  <p className="text-xs text-muted-foreground">
                    {isZh
                      ? `${daysRemaining} 天后到期`
                      : `${daysRemaining} days remaining`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Premium 特享功能 */}
        {tier === 'premium' && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            <p className="text-sm text-purple-600 font-medium mb-2">
              {isZh ? '✨ Premium 特享功能' : '✨ Premium Features'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-purple-300">
                {isZh ? '无限AI计划生成' : 'Unlimited AI Plans'}
              </Badge>
              <Badge variant="outline" className="border-purple-300">
                {isZh ? '高级训练计划' : 'Premium Plans'}
              </Badge>
              <Badge variant="outline" className="border-purple-300">
                {isZh ? '数据导出' : 'Data Export'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}