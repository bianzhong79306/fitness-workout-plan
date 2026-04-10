// ChallengeHistoryClient - 挑战历史客户端组件

'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Target, Flame, Calendar, Medal, Users, Trophy, Check, Clock, Gift, ArrowLeft, BarChart3, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { ChallengeWithProgress } from '@/types/challenge';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  flame: Flame,
  calendar: Calendar,
  medal: Medal,
  users: Users,
  trophy: Trophy,
};

const typeNames: Record<string, Record<string, string>> = {
  daily: { zh: '每日挑战', en: 'Daily' },
  weekly: { zh: '每周挑战', en: 'Weekly' },
  monthly: { zh: '每月挑战', en: 'Monthly' },
  community: { zh: '社区挑战', en: 'Community' },
};

const statusNames: Record<string, Record<string, string>> = {
  completed: { zh: '已完成', en: 'Completed' },
  expired: { zh: '已过期', en: 'Expired' },
  active: { zh: '进行中', en: 'Active' },
};

interface HistoryStats {
  total: number;
  completed: number;
  expired: number;
  totalPointsEarned: number;
}

export function ChallengeHistoryClient({ locale }: { locale: string }) {
  const [history, setHistory] = useState<ChallengeWithProgress[]>([]);
  const [stats, setStats] = useState<HistoryStats>({ total: 0, completed: 0, expired: 0, totalPointsEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  const isZh = locale === 'zh';

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/challenges/history?status=${activeTab === 'all' ? '' : activeTab}`);
      const data = await res.json() as { history?: ChallengeWithProgress[]; stats?: HistoryStats };
      setHistory(data.history || []);
      setStats(data.stats || { total: 0, completed: 0, expired: 0, totalPointsEarned: 0 });
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Clock className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Link href="/challenges">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {isZh ? '返回挑战列表' : 'Back to Challenges'}
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? '挑战历史' : 'Challenge History'}
        </h1>
        <p className="text-muted-foreground">
          {isZh
            ? '查看你参与过的所有挑战记录'
            : 'View all challenges you have participated in'}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isZh ? '总参与' : 'Total'}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isZh ? '已完成' : 'Completed'}</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isZh ? '已过期' : 'Expired'}</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isZh ? '获得积分' : 'Points'}</p>
                <p className="text-2xl font-bold">{stats.totalPointsEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">{isZh ? '全部' : 'All'}</TabsTrigger>
          <TabsTrigger value="completed">{isZh ? '已完成' : 'Completed'}</TabsTrigger>
          <TabsTrigger value="expired">{isZh ? '已过期' : 'Expired'}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* History List */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {activeTab === 'completed'
                ? (isZh ? '暂无已完成的挑战' : 'No completed challenges')
                : activeTab === 'expired'
                ? (isZh ? '暂无已过期的挑战' : 'No expired challenges')
                : (isZh ? '暂无挑战历史' : 'No challenge history')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map(challenge => {
            const IconComponent = iconMap[challenge.icon] || Target;
            const userChallenge = challenge.userChallenge;
            const isCompleted = userChallenge?.status === 'completed';
            const isExpired = userChallenge?.status === 'expired';
            const progress = userChallenge?.current_progress || 0;
            const target = challenge.goal_value;
            const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;
            const hasClaimed = userChallenge?.reward_claimed;

            return (
              <Card key={`${challenge.id}-${userChallenge?.id}`} className={`${isCompleted ? 'border-green-500' : isExpired ? 'border-red-500' : ''}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/20' : isExpired ? 'bg-red-500/20' : 'bg-muted'}`}>
                        <IconComponent className={`w-5 h-5 ${isCompleted ? 'text-green-500' : isExpired ? 'text-red-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {isZh ? challenge.name : challenge.name_en}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {typeNames[challenge.challenge_type]?.[locale] || challenge.challenge_type}
                          </Badge>
                          <Badge className={`text-xs ${isCompleted ? 'bg-green-500' : isExpired ? 'bg-red-500' : ''}`}>
                            {statusNames[userChallenge?.status || 'active']?.[locale] || userChallenge?.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-500">
                        {hasClaimed ? `+${challenge.reward_points}` : isCompleted ? `${challenge.reward_points}` : '0'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isZh ? '积分' : 'points'}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{isZh ? '进度' : 'Progress'}</span>
                      <span>{progress}/{target}</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  {/* Time Info */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isZh ? '参与时间' : 'Joined'}: {userChallenge?.joined_at ? new Date(userChallenge.joined_at).toLocaleDateString(isZh ? 'zh-CN' : 'en-US') : '-'}
                    </div>
                    {userChallenge?.completed_at && (
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {isZh ? '完成时间' : 'Completed'}: {new Date(userChallenge.completed_at).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}
                      </div>
                    )}
                  </div>

                  {/* Claim Status */}
                  {isCompleted && (
                    <div className="mt-2 flex items-center gap-2">
                      {hasClaimed ? (
                        <Badge variant="secondary" className="gap-1">
                          <Trophy className="w-3 h-3" />
                          {isZh ? '奖励已领取' : 'Reward Claimed'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-500 gap-1">
                          <Gift className="w-3 h-3" />
                          {isZh ? '奖励未领取' : 'Reward Unclaimed'}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}