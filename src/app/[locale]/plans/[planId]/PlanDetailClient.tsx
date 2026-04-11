// 计划详情客户端组件 - 学习模式
// 用户在这里学习计划结构，然后自己去实践
// 高级计划需要 Pro 会员才能查看完整内容

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Dumbbell, Clock, Calendar, Info, ArrowUpRight, Lock, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@/i18n/routing';

interface PlanDetail {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  goal: string;
  difficulty: string;
  duration_weeks: number;
  sessions_per_week: number;
  is_premium: boolean;
  sessions: Array<{
    session_number: number;
    name: string;
    name_en: string;
    duration_minutes: number;
    exercises_json: string;
  }>;
}

interface Exercise {
  exerciseId?: string;
  name: string;
  nameEn: string;
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds: number;
  weight?: number;
}

export default function PlanDetailClient({ locale, planId }: { locale: string; planId: string }) {
  const { data: session } = useSession();
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<number>(0);
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [tierLoading, setTierLoading] = useState(true);

  const isZh = locale === 'zh';

  useEffect(() => {
    // 获取用户会员等级
    if (session?.user) {
      fetch('/api/membership/user')
        .then(res => res.json())
        .then(data => {
          if (data && typeof data === 'object' && data !== null) {
            const obj = data as Record<string, unknown>;
            if (obj.tier === 'pro') setUserTier('pro');
          }
        })
        .catch(() => {})
        .finally(() => setTierLoading(false));
    } else {
      setTierLoading(false);
    }

    fetch(`/api/plans/${planId}`)
      .then(res => res.json())
      .then(data => {
        const d = data as { plan?: PlanDetail };
        if (d.plan) setPlan(d.plan);
        else setError('Plan not found');
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [planId, session]);

  const getExercises = (sessionIndex: number): Exercise[] => {
    if (!plan?.sessions[sessionIndex]) return [];
    try {
      return JSON.parse(plan.sessions[sessionIndex].exercises_json || '[]');
    } catch {
      return [];
    }
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, Record<string, string>> = {
      muscle_gain: { zh: '增肌塑形', en: 'Muscle Gain' },
      fat_loss: { zh: '减脂瘦身', en: 'Fat Loss' },
      strength: { zh: '力量提升', en: 'Strength' },
      endurance: { zh: '耐力提升', en: 'Endurance' },
      general: { zh: '综合健身', en: 'General Fitness' },
    };
    return labels[goal]?.[locale] ?? goal;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, Record<string, string>> = {
      beginner: { zh: '初级', en: 'Beginner' },
      intermediate: { zh: '中级', en: 'Intermediate' },
      advanced: { zh: '高级', en: 'Advanced' },
    };
    return labels[difficulty]?.[locale] ?? difficulty;
  };

  if (loading || tierLoading) {
    return <div className="container py-8 text-center">{isZh ? '加载中...' : 'Loading...'}</div>;
  }

  if (error || !plan) {
    return <div className="container py-8 text-center text-red-500">{error || 'Not found'}</div>;
  }

  const exercises = getExercises(selectedSession);
  const currentSession = plan.sessions[selectedSession];

  // 高级计划权限检查：免费用户锁定
  const isLocked = plan.is_premium && userTier !== 'pro';

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* 学习提示 */}
      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <Info className="w-4 h-4 text-primary" />
        <AlertDescription>
          {isZh
            ? '💡 这是训练计划的学习页面。仔细了解每个动作的安排，然后自己安排时间去实践。'
            : '💡 This is a learning page for the workout plan. Understand each exercise arrangement.'}
        </AlertDescription>
      </Alert>

      {/* 计划概览 - 所有人都能看到基本信息 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {isZh ? plan.name : plan.name_en}
              </CardTitle>
              <CardDescription className="mt-2">
                {isZh ? plan.description : plan.description_en}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isLocked && (
                <Badge variant="default" className="gap-1 bg-orange-500">
                  <Lock className="w-3 h-3" />
                  {isZh ? '高级计划' : 'Premium'}
                </Badge>
              )}
              {!isLocked && plan.is_premium && (
                <Badge variant="default" className="gap-1 bg-green-600">
                  <Crown className="w-3 h-3" />
                  {isZh ? '已解锁' : 'Unlocked'}
                </Badge>
              )}
              {!plan.is_premium && (
                <Badge variant="secondary">{isZh ? '免费计划' : 'Free'}</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              🎯 {getGoalLabel(plan.goal)}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {plan.duration_weeks} {isZh ? '周' : 'weeks'}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              {plan.sessions_per_week} {isZh ? '次/周' : 'sessions/week'}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {getDifficultyLabel(plan.difficulty)}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* 高级计划锁定提示 */}
      {isLocked && (
        <Card className="mb-6 border-orange-300 bg-orange-50">
          <CardContent className="py-8 text-center">
            <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-orange-700">
              {isZh ? '🔒 这是高级计划' : '🔒 Premium Plan'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isZh
                ? '升级高级会员后可查看完整训练课程内容'
                : 'Upgrade to Pro to unlock the complete workout content'}
            </p>
            <div className="text-2xl font-bold text-primary mb-2">
              $1.99<span className="text-sm text-muted-foreground">/月</span>
            </div>
            <Link href="/pricing">
              <Button size="lg" className="gap-2">
                <Crown className="w-4 h-4" />
                {isZh ? '立即升级' : 'Upgrade Now'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* 训练课程详情 - 只有 Pro 用户或免费计划才能看到 */}
      {!isLocked && (
        <>
          {/* 课程选择 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {plan.sessions.map((s, idx) => (
              <Button
                key={s.session_number}
                variant={selectedSession === idx ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSession(idx)}
              >
                {isZh ? s.name : s.name_en}
              </Button>
            ))}
          </div>

          {/* 当前课程详情 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isZh ? currentSession?.name : currentSession?.name_en}</span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentSession?.duration_minutes} {isZh ? '分钟' : 'min'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        {ex.exerciseId ? (
                          <Link
                            href={`/exercises/${ex.exerciseId}`}
                            className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                          >
                            {isZh ? ex.name : ex.nameEn}
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="font-medium">{isZh ? ex.name : ex.nameEn}</span>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {isZh ? `休息 ${ex.restSeconds} 秒` : `Rest ${ex.restSeconds}s`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {ex.sets} × {ex.reps || `${ex.duration}s`}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 计划原理 */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">
                {isZh ? '📋 计划原理' : '📋 Plan Principles'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                {isZh
                  ? `这是一个为期 ${plan.duration_weeks} 周的训练计划，每周 ${plan.sessions_per_week} 次训练。`
                  : `This is a ${plan.duration_weeks}-week plan with ${plan.sessions_per_week} sessions per week.`}
              </p>
              <p>
                {isZh
                  ? '建议在实际训练前，先了解每个动作的正确姿势和要点。'
                  : 'We recommend understanding correct form before training.'}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* 底部操作按钮 */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/exercises" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Dumbbell className="w-4 h-4" />
            {isZh ? '查看动作百科' : 'Browse Exercises'}
          </Button>
        </Link>
        <Link href="/ai-plan" className="flex-1">
          <Button className="w-full gap-2">
            {isZh ? '生成个性化计划' : 'Generate Plan'}
          </Button>
        </Link>
      </div>
    </div>
  );
}