// Challenges Card Component

'use client';

import { useState, useEffect } from 'react';
import { Target, Flame, Calendar, Medal, Users, Trophy, Plus, Check, Clock, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

export function ChallengesCard({ locale }: { locale: string }) {
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      const data = (await res.json()) as { challenges?: ChallengeWithProgress[] };
      setChallenges(data.challenges || []);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          {locale === 'zh' ? '加载中...' : 'Loading...'}
        </CardContent>
      </Card>
    );
  }

  // 按类型分组
  const grouped: Record<string, ChallengeWithProgress[]> = {};
  challenges.forEach(c => {
    if (!grouped[c.challenge_type]) grouped[c.challenge_type] = [];
    grouped[c.challenge_type].push(c);
  });

  const typeOrder = ['daily', 'weekly', 'monthly', 'community'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {locale === 'zh' ? '挑战赛' : 'Challenges'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {typeOrder.map(type => {
          const typeChallenges = grouped[type];
          if (!typeChallenges || typeChallenges.length === 0) return null;

          return (
            <div key={type}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {typeNames[type]?.[locale] || type}
              </h3>
              <div className="space-y-3">
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
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg border ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : isJoined
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-muted/30 border-muted'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-5 h-5 ${isCompleted ? 'text-green-500' : isJoined ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-medium">
                            {locale === 'zh' ? challenge.name : challenge.name_en}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            +{challenge.reward_points} {locale === 'zh' ? '积分' : 'pts'}
                          </Badge>
                          {isCompleted && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {locale === 'zh' ? challenge.description : challenge.description_en}
                      </p>

                      {isJoined && !isCompleted && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{locale === 'zh' ? '进度' : 'Progress'}</span>
                            <span>{progress}/{target}</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {challenge.participants_count} {locale === 'zh' ? '人参与' : 'participants'}
                        </div>

                        {!isJoined && !isCompleted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleJoin(challenge.id)}
                            disabled={joining === challenge.id}
                          >
                            {joining === challenge.id
                              ? (locale === 'zh' ? '加入中...' : 'Joining...')
                              : (locale === 'zh' ? '参与挑战' : 'Join')}
                          </Button>
                        )}

                        {isCompleted && (
                          <Badge className="bg-green-500">
                            {locale === 'zh' ? '已完成' : 'Completed'}
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
                              ? (locale === 'zh' ? '领取中...' : 'Claiming...')
                              : (locale === 'zh' ? '领取奖励' : 'Claim Reward')}
                          </Button>
                        )}

                        {hasClaimed && (
                          <Badge variant="secondary" className="gap-1">
                            <Trophy className="w-3 h-3" />
                            {locale === 'zh' ? '奖励已领取' : 'Claimed'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {challenges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {locale === 'zh' ? '暂无进行中的挑战' : 'No active challenges'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}