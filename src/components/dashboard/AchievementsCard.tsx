// Achievements Card Component

'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Medal, Award, Crown, Sunrise, Moon, Dumbbell, Target, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  icon: string;
  category: string;
  points: number;
  unlocked_at?: string;
}

interface AchievementsData {
  achievements: Achievement[];
  totalPoints?: number;
  totalUnlocked?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  medal: Medal,
  award: Award,
  crown: Crown,
  sunrise: Sunrise,
  moon: Moon,
  dumbbell: Dumbbell,
  target: Target,
};

export function AchievementsCard({ locale }: { locale: string }) {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/achievements').then(res => res.json()),
      fetch('/api/achievements?user_only=true').then(res => res.json()),
    ])
      .then(([allData, userData]) => {
        const all = allData as AchievementsData;
        const user = userData as AchievementsData;
        setAllAchievements(all.achievements || []);
        setUserAchievements(user.achievements || []);
        setTotalPoints(user.totalPoints || 0);
      })
      .catch(err => console.error('Failed to fetch achievements:', err))
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

  const unlockedIds = userAchievements.map(a => a.id);
  const totalAchievements = allAchievements.length;
  const unlockedCount = userAchievements.length;
  const progressPercent = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  // 按类别分组
  const categorized: Record<string, Achievement[]> = {};
  allAchievements.forEach(a => {
    if (!categorized[a.category]) categorized[a.category] = [];
    categorized[a.category].push(a);
  });

  const categoryNames: Record<string, Record<string, string>> = {
    milestone: { zh: '里程碑', en: 'Milestones' },
    streak: { zh: '连续训练', en: 'Streaks' },
    special: { zh: '特殊成就', en: 'Special' },
    goal: { zh: '目标达成', en: 'Goals' },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            {locale === 'zh' ? '成就' : 'Achievements'}
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Star className="w-3 h-3" />
            {totalPoints} {locale === 'zh' ? '积分' : 'pts'}
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{locale === 'zh' ? `已解锁 ${unlockedCount}/${totalAchievements}` : `${unlockedCount}/${totalAchievements} unlocked`}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(categorized).map(([category, achievements]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {categoryNames[category]?.[locale] || category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.map(achievement => {
                const IconComponent = iconMap[achievement.icon] || Trophy;
                const isUnlocked = unlockedIds.includes(achievement.id);

                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      isUnlocked
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-muted/50 border-muted opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className={`w-4 h-4 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium truncate">
                        {locale === 'zh' ? achievement.name : achievement.name_en}
                      </span>
                      {!isUnlocked && <Lock className="w-3 h-3 text-muted-foreground ml-auto" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {locale === 'zh' ? achievement.description : achievement.description_en}
                    </p>
                    {isUnlocked && achievement.unlocked_at && (
                      <p className="text-xs text-primary mt-1">
                        {locale === 'zh' ? '解锁于 ' : 'Unlocked '}
                        {new Date(achievement.unlocked_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}