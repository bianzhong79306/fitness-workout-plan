// Challenge Leaderboard Component - 社区挑战排行榜

'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardEntry {
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  contribution: number;
  rank: number;
}

interface CommunityChallenge {
  id: string;
  name: string;
  name_en: string;
  goal_value: number;
  participants_count: number;
}

interface LeaderboardData {
  challenge: CommunityChallenge;
  leaderboard: LeaderboardEntry[];
  participantsCount: number;
}

export function ChallengeLeaderboard({ locale }: { locale: string }) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取社区挑战的排行榜
    fetch('/api/challenges?type=community')
      .then(res => res.json())
      .then(async (challengesData) => {
        const cd = challengesData as { challenges?: Array<{ id: string }> };
        const communityChallenges = cd.challenges || [];

        if (communityChallenges.length > 0) {
          // 获取第一个社区挑战的排行榜
          const detailRes = await fetch(`/api/challenges/${communityChallenges[0].id}`);
          const detailData = await detailRes.json() as LeaderboardData;
          setData(detailData);
        }
      })
      .catch(err => console.error('Failed to fetch leaderboard:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          {locale === 'zh' ? '加载中...' : 'Loading...'}
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.leaderboard || data.leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {locale === 'zh' ? '社区排行榜' : 'Community Leaderboard'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-muted-foreground">
          {locale === 'zh' ? '暂无社区挑战进行中' : 'No community challenge active'}
        </CardContent>
      </Card>
    );
  }

  const challenge = data.challenge;
  const leaderboard = data.leaderboard;
  const totalProgress = leaderboard.reduce((sum, e) => sum + e.contribution, 0);
  const progressPercent = Math.min((totalProgress / challenge.goal_value) * 100, 100);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-orange-500" />;
    return <span className="text-sm font-medium">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/30';
    if (rank === 2) return 'bg-gray-400/10 border-gray-400/30';
    if (rank === 3) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-muted/50';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {locale === 'zh' ? '社区排行榜' : 'Community Leaderboard'}
          </CardTitle>
          <Badge variant="secondary">
            {challenge.participants_count} {locale === 'zh' ? '人参与' : 'joined'}
          </Badge>
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">
            {locale === 'zh' ? challenge.name : challenge.name_en}
          </p>
          <div className="flex justify-between text-sm mb-1">
            <span>{locale === 'zh' ? '社区总进度' : 'Community Progress'}</span>
            <span className="font-medium">
              {totalProgress}/{challenge.goal_value}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent >= 100 && (
            <p className="text-xs text-green-500 mt-1 font-medium">
              {locale === 'zh' ? '社区目标已达成!' : 'Community goal achieved!'}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map(entry => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${getRankBg(entry.rank)}`}
            >
              <div className="flex items-center justify-center w-6">
                {getRankIcon(entry.rank)}
              </div>

              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.user_avatar || undefined} />
                <AvatarFallback>
                  {entry.user_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {entry.user_name || (locale === 'zh' ? '匿名用户' : 'Anonymous')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-primary">
                  {entry.contribution}
                </p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' ? '贡献' : 'contrib'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {leaderboard.length < challenge.participants_count && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            {locale === 'zh'
              ? `还有 ${challenge.participants_count - leaderboard.length} 位参与者`
              : `${challenge.participants_count - leaderboard.length} more participants`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}