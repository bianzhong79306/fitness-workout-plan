// ChallengesClient - 挑战赛列表客户端组件

'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Target, Flame, Calendar, Medal, Users, Trophy, Plus, Check, Clock, Gift, Filter, ChevronRight, BarChart3 } from 'lucide-react';
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
  daily: { zh: '每日挑战', en: 'Daily Challenges' },
  weekly: { zh: '每周挑战', en: 'Weekly Challenges' },
  monthly: { zh: '每月挑战', en: 'Monthly Challenges' },
  community: { zh: '社区挑战', en: 'Community Challenges' },
};

const goalTypeNames: Record<string, Record<string, string>> = {
  workouts: { zh: '完成训练', en: 'Workouts' },
  duration: { zh: '训练时长', en: 'Duration' },
  sets: { zh: '完成组数', en: 'Sets' },
  streak_days: { zh: '连续天数', en: 'Streak Days' },
  community_total: { zh: '社区总贡献', en: 'Community Total' },
};

export function ChallengesClient({ locale }: { locale: string }) {
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [stats, setStats] = useState({
    totalJoined: 0,
    totalCompleted: 0,
    totalPoints: 0,
  });

  const isZh = locale === 'zh';

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      const data = await res.json() as { challenges?: ChallengeWithProgress[] };
      setChallenges(data.challenges || []);

      // 计算统计
      const joined = data.challenges?.filter(c => c.is_joined) || [];
      const completed = joined.filter(c => c.userChallenge?.status === 'completed');
      const points = completed
        .filter(c => c.userChallenge?.reward_claimed)
        .reduce((sum, c) => sum + (c.reward_points || 0), 0);

      setStats({
        totalJoined: joined.length,
        totalCompleted: completed.length,
        totalPoints: points,
      });
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (challengeId: string) => {
    setJoining(challengeId);
    try {
      const response = await fetch(`/api/challenges/${challengeId}/join`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json() as { userChallenge: { current_progress: number; target_progress: number } };
        setChallenges(prev =>
          prev.map(c => {
            if (c.id === challengeId) {
              return {
                ...c,
                userChallenge: {
                  ...data.userChallenge,
                  challenge_id: challengeId,
                  status: 'active',
                  current_progress: data.userChallenge.current_progress,
                  target_progress: data.userChallenge.target_progress,
                } as ChallengeWithProgress['userChallenge'],
                is_joined: true,
                participants_count: c.participants_count + 1,
              };
            }
            return c;
          })
        );
        setStats(prev => ({ ...prev, totalJoined: prev.totalJoined + 1 }));
      }
    } catch (err) {
      console.error('Failed to join challenge:', err);
    } finally {
      setJoining(null);
    }
  };

  const handleClaim = async (challengeId: string) => {
    setClaiming(challengeId);
    try {
      const response = await fetch(`/api/challenges/${challengeId}/claim`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchChallenges();
      }
    } catch (err) {
      console.error('Failed to claim reward:', err);
    } finally {
      setClaiming(null);
    }
  };

  // 筛选挑战
  const filteredChallenges = activeTab === 'all'
    ? challenges
    : challenges.filter(c => c.challenge_type === activeTab);

  // 按类型分组
  const grouped: Record<string, ChallengeWithProgress[]> = {};
  filteredChallenges.forEach(c => {
    if (!grouped[c.challenge_type]) grouped[c.challenge_type] = [];
    grouped[c.challenge_type].push(c);
  });

  const typeOrder = ['daily', 'weekly', 'monthly', 'community'];

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">{isZh ? '加载中...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? '挑战赛' : 'Challenges'}
        </h1>
        <p className="text-muted-foreground">
          {isZh
            ? '参与挑战，赢取积分和成就徽章！'
            : 'Join challenges, earn points and achievement badges!'}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{isZh ? '已参与' : 'Joined'}</p>
                <p className="text-2xl font-bold">{stats.totalJoined}</p>
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
                <p className="text-2xl font-bold">{stats.totalCompleted}</p>
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
                <p className="text-sm text-muted-foreground">{isZh ? '获得积分' : 'Points Earned'}</p>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">{isZh ? '全部' : 'All'}</TabsTrigger>
          <TabsTrigger value="daily">{isZh ? '每日' : 'Daily'}</TabsTrigger>
          <TabsTrigger value="weekly">{isZh ? '每周' : 'Weekly'}</TabsTrigger>
          <TabsTrigger value="monthly">{isZh ? '每月' : 'Monthly'}</TabsTrigger>
          <TabsTrigger value="community">{isZh ? '社区' : 'Community'}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Navigation Links */}
      <div className="flex gap-4 mb-6">
        <Link href="/challenges/history">
          <Button variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            {isZh ? '挑战历史' : 'History'}
          </Button>
        </Link>
      </div>

      {/* Challenges List */}
      {typeOrder.map(type => {
        const typeChallenges = grouped[type];
        if (!typeChallenges || typeChallenges.length === 0) return null;

        return (
          <div key={type} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">
                {typeNames[type]?.[locale] || type}
              </h2>
              <Badge variant="secondary">{typeChallenges.length}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeChallenges.map(challenge => {
                const IconComponent = iconMap[challenge.icon] || Target;
                const isJoined = challenge.is_joined;
                const progress = challenge.userChallenge?.current_progress || 0;
                const target = challenge.goal_value;
                const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;
                const isCompleted = challenge.userChallenge?.status === 'completed';
                const canClaim = isCompleted && !challenge.userChallenge?.reward_claimed;
                const hasClaimed = challenge.userChallenge?.reward_claimed;

                return (
                  <Card key={challenge.id} className={`overflow-hidden ${isCompleted ? 'border-green-500' : isJoined ? 'border-primary' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-5 h-5 ${isCompleted ? 'text-green-500' : isJoined ? 'text-primary' : 'text-muted-foreground'}`} />
                          <CardTitle className="text-lg">
                            {isZh ? challenge.name : challenge.name_en}
                          </CardTitle>
                        </div>
                        {isCompleted && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {isZh ? challenge.description : challenge.description_en}
                      </p>

                      {/* Goal Info */}
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <Badge variant="outline">
                          {goalTypeNames[challenge.goal_type]?.[locale] || challenge.goal_type}: {challenge.goal_value}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Trophy className="w-3 h-3" />
                          +{challenge.reward_points} {isZh ? '积分' : 'pts'}
                        </Badge>
                      </div>

                      {/* Progress */}
                      {isJoined && !isCompleted && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{isZh ? '进度' : 'Progress'}</span>
                            <span className="font-medium">{progress}/{target}</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}

                      {/* Participants */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Users className="w-3 h-3" />
                        {challenge.participants_count} {isZh ? '人参与' : 'participants'}
                        {challenge.completions_count > 0 && (
                          <span className="ml-2">
                            ({challenge.completions_count} {isZh ? '人完成' : 'completed'})
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <Link href={`/challenges/${challenge.id}`} className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full gap-1">
                            <ChevronRight className="w-4 h-4" />
                            {isZh ? '详情' : 'Details'}
                          </Button>
                        </Link>

                        {!isJoined && !isCompleted && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleJoin(challenge.id)}
                            disabled={joining === challenge.id}
                          >
                            {joining === challenge.id
                              ? (isZh ? '加入中...' : 'Joining...')
                              : (isZh ? '参与' : 'Join')}
                          </Button>
                        )}

                        {isCompleted && !hasClaimed && (
                          <Badge className="bg-green-500">
                            {isZh ? '已完成' : 'Completed'}
                          </Badge>
                        )}

                        {canClaim && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleClaim(challenge.id)}
                            disabled={claiming === challenge.id}
                            className="gap-1"
                          >
                            <Gift className="w-4 h-4" />
                            {claiming === challenge.id
                              ? (isZh ? '领取中...' : 'Claiming...')
                              : (isZh ? '领取奖励' : 'Claim')}
                          </Button>
                        )}

                        {hasClaimed && (
                          <Badge variant="secondary" className="gap-1">
                            <Trophy className="w-3 h-3" />
                            {isZh ? '已领取' : 'Claimed'}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {challenges.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isZh ? '暂无进行中的挑战，请稍后再来！' : 'No active challenges. Check back later!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}