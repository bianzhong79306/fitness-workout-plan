// ChallengeDetailClient - 挑战详情客户端组件

'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { Target, Flame, Calendar, Medal, Users, Trophy, Check, Clock, Gift, ArrowLeft, Timer, Share2, ChevronRight, Crown, MedalIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Challenge, UserChallenge, LeaderboardEntry } from '@/types/challenge';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  flame: Flame,
  calendar: Calendar,
  medal: Medal,
  users: Users,
  trophy: Trophy,
};

const typeNames: Record<string, Record<string, string>> = {
  daily: { zh: '每日挑战', en: 'Daily Challenge' },
  weekly: { zh: '每周挑战', en: 'Weekly Challenge' },
  monthly: { zh: '每月挑战', en: 'Monthly Challenge' },
  community: { zh: '社区挑战', en: 'Community Challenge' },
};

const goalTypeNames: Record<string, Record<string, string>> = {
  workouts: { zh: '完成训练次数', en: 'Workouts to complete' },
  duration: { zh: '训练时长（分钟）', en: 'Training duration (mins)' },
  sets: { zh: '完成训练组数', en: 'Sets to complete' },
  streak_days: { zh: '连续训练天数', en: 'Consecutive days' },
  community_total: { zh: '社区总贡献', en: 'Community total contribution' },
};

interface ChallengeDetailData {
  challenge: Challenge;
  userChallenge: UserChallenge | null;
  isJoined: boolean;
  leaderboard: LeaderboardEntry[];
  participantsCount: number;
}

export function ChallengeDetailClient({ locale, challengeId }: { locale: string; challengeId: string }) {
  const [data, setData] = useState<ChallengeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const router = useRouter();

  const isZh = locale === 'zh';

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/challenges/${challengeId}`);
      const result = await res.json() as ChallengeDetailData;
      setData(result);
    } catch (err) {
      console.error('Failed to fetch challenge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [challengeId]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const response = await fetch(`/api/challenges/${challengeId}/join`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchChallenge();
      }
    } catch (err) {
      console.error('Failed to join challenge:', err);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      const response = await fetch(`/api/challenges/${challengeId}/join`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchChallenge();
      }
    } catch (err) {
      console.error('Failed to leave challenge:', err);
    } finally {
      setLeaving(false);
    }
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const response = await fetch(`/api/challenges/${challengeId}/claim`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchChallenge();
      }
    } catch (err) {
      console.error('Failed to claim reward:', err);
    } finally {
      setClaiming(false);
    }
  };

  // 计算剩余时间
  const calculateRemainingTime = () => {
    if (!data?.challenge) return null;
    const endAt = new Date(data.challenge.end_at);
    const now = new Date();
    const diff = endAt.getTime() - now.getTime();

    if (diff <= 0) return isZh ? '已结束' : 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return isZh ? `${days}天 ${hours}小时` : `${days}d ${hours}h`;
    }
    if (hours > 0) {
      return isZh ? `${hours}小时 ${minutes}分钟` : `${hours}h ${minutes}m`;
    }
    return isZh ? `${minutes}分钟` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Target className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data?.challenge) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{isZh ? '挑战不存在或已结束' : 'Challenge not found or ended'}</p>
            <Link href="/challenges">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isZh ? '返回挑战列表' : 'Back to Challenges'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const challenge = data.challenge;
  const userChallenge = data.userChallenge;
  const isJoined = data.isJoined;
  const isCompleted = userChallenge?.status === 'completed';
  const canClaim = isCompleted && !userChallenge?.reward_claimed;
  const hasClaimed = userChallenge?.reward_claimed;
  const progress = userChallenge?.current_progress || 0;
  const target = challenge.goal_value;
  const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

  const IconComponent = iconMap[challenge.icon] || Target;
  const remainingTime = calculateRemainingTime();

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Link href="/challenges">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {isZh ? '返回挑战列表' : 'Back to Challenges'}
        </Button>
      </Link>

      {/* Challenge Header */}
      <Card className={`mb-6 ${isCompleted ? 'border-green-500' : isJoined ? 'border-primary' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-500/20' : isJoined ? 'bg-primary/20' : 'bg-muted'}`}>
                <IconComponent className={`w-8 h-8 ${isCompleted ? 'text-green-500' : isJoined ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {isZh ? challenge.name : challenge.name_en}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {typeNames[challenge.challenge_type]?.[locale] || challenge.challenge_type}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-green-500 gap-1">
                      <Check className="w-3 h-3" />
                      {isZh ? '已完成' : 'Completed'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span className="text-xl font-bold">{challenge.reward_points}</span>
              </div>
              <p className="text-sm text-muted-foreground">{isZh ? '积分奖励' : 'Points Reward'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isZh ? challenge.description : challenge.description_en}
          </p>

          {/* Time & Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{isZh ? '剩余时间' : 'Time Left'}</p>
                <p className="font-medium">{remainingTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{isZh ? '参与人数' : 'Participants'}</p>
                <p className="font-medium">{challenge.participants_count}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{isZh ? '完成人数' : 'Completed'}</p>
                <p className="font-medium">{challenge.completions_count}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{isZh ? '目标' : 'Goal'}</p>
                <p className="font-medium">{challenge.goal_value} {goalTypeNames[challenge.goal_type]?.[locale]?.split(' ')[0] || ''}</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {isJoined && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{isZh ? '我的进度' : 'My Progress'}</span>
                <span className="text-lg font-bold">{progress}/{target}</span>
              </div>
              <Progress value={progressPercent} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2">
                {progressPercent >= 100
                  ? (isZh ? '目标已达成！' : 'Goal achieved!')
                  : (isZh ? `还需完成 ${target - progress} 次` : `Need ${target - progress} more to complete`)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!isJoined && !isCompleted && (
              <Button size="lg" onClick={handleJoin} disabled={joining}>
                {joining
                  ? (isZh ? '加入中...' : 'Joining...')
                  : (isZh ? '参与挑战' : 'Join Challenge')}
              </Button>
            )}

            {isJoined && !isCompleted && (
              <Button size="lg" variant="outline" onClick={handleLeave} disabled={leaving}>
                {leaving
                  ? (isZh ? '退出中...' : 'Leaving...')
                  : (isZh ? '退出挑战' : 'Leave Challenge')}
              </Button>
            )}

            {canClaim && (
              <Button size="lg" variant="default" onClick={handleClaim} disabled={claiming} className="gap-2">
                <Gift className="w-5 h-5" />
                {claiming
                  ? (isZh ? '领取中...' : 'Claiming...')
                  : (isZh ? '领取奖励' : 'Claim Reward')}
              </Button>
            )}

            {hasClaimed && (
              <Badge className="bg-green-500 text-lg px-4 py-2 gap-2">
                <Trophy className="w-5 h-5" />
                {isZh ? '奖励已领取' : 'Reward Claimed'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rules Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {isZh ? '挑战规则' : 'Challenge Rules'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-primary" />
              <span>
                {isZh
                  ? `完成目标：${goalTypeNames[challenge.goal_type]?.[locale] || challenge.goal_type} ${challenge.goal_value} 次/单位`
                  : `Goal: ${goalTypeNames[challenge.goal_type]?.[locale] || challenge.goal_type} - ${challenge.goal_value}`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-primary" />
              <span>
                {isZh
                  ? `挑战时间：${new Date(challenge.start_at).toLocaleDateString('zh-CN')} 至 ${new Date(challenge.end_at).toLocaleDateString('zh-CN')}`
                  : `Duration: ${new Date(challenge.start_at).toLocaleDateString()} to ${new Date(challenge.end_at).toLocaleDateString()}`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-1 text-primary" />
              <span>
                {isZh
                  ? `完成后可获得 ${challenge.reward_points} 积分奖励`
                  : `Earn ${challenge.reward_points} points upon completion`}
              </span>
            </li>
            {challenge.reward_achievement_id && (
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-primary" />
                <span>
                  {isZh
                    ? '完成挑战可解锁专属成就徽章'
                    : 'Unlock exclusive achievement badge upon completion'}
                </span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Leaderboard for Community Challenges */}
      {challenge.challenge_type === 'community' && data.leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              {isZh ? '排行榜' : 'Leaderboard'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.leaderboard.map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${index === 0 ? 'bg-yellow-500/10' : index === 1 ? 'bg-gray-400/10' : index === 2 ? 'bg-orange-500/10' : 'bg-muted/50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {entry.rank}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.user_avatar || ''} />
                    <AvatarFallback>{entry.user_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{entry.user_name || 'Anonymous'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{entry.contribution}</p>
                    <p className="text-xs text-muted-foreground">{isZh ? '贡献' : 'contrib'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}