// 计划详情客户端组件 - 学习模式
// 用户在这里学习计划结构，然后自己去实践

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dumbbell, Clock, Calendar, Info, ArrowUpRight } from 'lucide-react';
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
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/plans/${planId}`)
      .then(res => res.json())
      .then(data => {
        const d = data as { plan?: PlanDetail };
        if (d.plan) setPlan(d.plan);
        else setError('Plan not found');
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [planId]);

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

  if (loading) {
    return <div className="container py-8 text-center">{locale === 'zh' ? '加载中...' : 'Loading...'}</div>;
  }

  if (error || !plan) {
    return <div className="container py-8 text-center text-red-500">{error || 'Not found'}</div>;
  }

  const exercises = getExercises(selectedSession);
  const currentSession = plan.sessions[selectedSession];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* 学习提示 */}
      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <Info className="w-4 h-4 text-primary" />
        <AlertDescription>
          {locale === 'zh'
            ? '💡 这是训练计划的学习页面。仔细了解每个动作的安排，然后自己安排时间去实践。点击动作名称可以查看详细教学。'
            : '💡 This is a learning page for the workout plan. Understand each exercise arrangement, then practice on your own time. Click exercise names to see detailed instructions.'}
        </AlertDescription>
      </Alert>

      {/* 计划概览 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {locale === 'zh' ? plan.name : plan.name_en}
              </CardTitle>
              <CardDescription className="mt-2">
                {locale === 'zh' ? plan.description : plan.description_en}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={plan.is_premium ? 'default' : 'secondary'}>
                {plan.is_premium
                  ? (locale === 'zh' ? '高级计划' : 'Premium Plan')
                  : (locale === 'zh' ? '免费计划' : 'Free Plan')}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <TargetIcon className="w-4 h-4" />
              {getGoalLabel(plan.goal)}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {plan.duration_weeks} {locale === 'zh' ? '周计划' : 'weeks'}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              {plan.sessions_per_week} {locale === 'zh' ? '次/周' : 'sessions/week'}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {locale === 'zh' ? `${getDifficultyLabel(plan.difficulty)}难度` : `${getDifficultyLabel(plan.difficulty)} level`}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* 训练课程选择 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {plan.sessions.map((s, idx) => (
          <Button
            key={s.session_number}
            variant={selectedSession === idx ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSession(idx)}
          >
            {locale === 'zh' ? s.name : s.name_en}
          </Button>
        ))}
      </div>

      {/* 当前课程详情 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {locale === 'zh' ? currentSession?.name : currentSession?.name_en}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentSession?.duration_minutes} {locale === 'zh' ? '分钟' : 'min'}
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
                    {/* 动作名称 - 可点击跳转到动作详情 */}
                    {ex.exerciseId ? (
                      <Link
                        href={`/exercises/${ex.exerciseId}`}
                        className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {locale === 'zh' ? ex.name : ex.nameEn}
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="font-medium">
                        {locale === 'zh' ? ex.name : ex.nameEn}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {locale === 'zh' ? `休息 ${ex.restSeconds} 秒` : `Rest ${ex.restSeconds}s`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-sm">
                    {ex.sets} × {ex.reps || `${ex.duration}s`}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 计划原理说明 */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'zh' ? '📋 计划原理' : '📋 Plan Principles'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            {locale === 'zh'
              ? `这是一个为期 ${plan.duration_weeks} 周的训练计划，每周 ${plan.sessions_per_week} 次训练。`
              : `This is a ${plan.duration_weeks}-week plan with ${plan.sessions_per_week} sessions per week.`}
          </p>
          <p>
            {locale === 'zh'
              ? '建议在实际训练前，先了解每个动作的正确姿势和要点。点击动作名称可以查看详细教学。'
              : 'We recommend understanding correct form and tips for each exercise before actual training. Click exercise names to see detailed instructions.'}
          </p>
          <p>
            {locale === 'zh'
              ? '根据渐进超负荷原则，可以随着训练进步逐渐增加重量或次数。'
              : 'Following progressive overload principles, gradually increase weight or reps as you progress.'}
          </p>
        </CardContent>
      </Card>

      {/* 底部操作按钮 */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/exercises" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Dumbbell className="w-4 h-4" />
            {locale === 'zh' ? '查看动作百科' : 'Browse Exercise Library'}
          </Button>
        </Link>
        <Link href="/ai-plan" className="flex-1">
          <Button className="w-full gap-2">
            {locale === 'zh' ? '生成个性化计划' : 'Generate Custom Plan'}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// 简单的目标图标
function TargetIcon({ className }: { className?: string }) {
  return <div className={className}>🎯</div>;
}