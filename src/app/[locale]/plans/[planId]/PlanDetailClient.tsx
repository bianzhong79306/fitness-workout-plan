// 计划详情客户端组件

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dumbbell, Clock, Calendar, CheckCircle, Play, Pause, SkipForward, X, Trophy, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

// 成就名称映射
const ACHIEVEMENT_NAMES: Record<string, Record<string, string>> = {
  'first-workout': { zh: '首次训练', en: 'First Workout' },
  'week-warrior': { zh: '周战士', en: 'Week Warrior' },
  'iron-will': { zh: '钢铁意志', en: 'Iron Will' },
  'ten-workouts': { zh: '健身新手', en: 'Fitness Beginner' },
  'fifty-workouts': { zh: '健身达人', en: 'Fitness Enthusiast' },
  'hundred-workouts': { zh: '健身大师', en: 'Fitness Master' },
  'early-bird': { zh: '早起鸟', en: 'Early Bird' },
  'night-owl': { zh: '夜猫子', en: 'Night Owl' },
  'thousand-sets': { zh: '千组成就', en: 'Thousand Sets' },
  'goal-crusher': { zh: '目标粉碎机', en: 'Goal Crusher' },
};

function getAchievementName(id: string, locale: string): string {
  return ACHIEVEMENT_NAMES[id]?.[locale] || id;
}

export default function PlanDetailClient({ locale, planId }: { locale: string; planId: string }) {
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 训练模式状态
  const [workoutMode, setWorkoutMode] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // 训练记录数据
  const [workoutStartedAt, setWorkoutStartedAt] = useState<string | null>(null);
  const [completedSets, setCompletedSets] = useState<Array<{exerciseId: string; name: string; sets: number; reps: number; weight?: number}>>([]);
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [workoutStats, setWorkoutStats] = useState<{duration: number; sets: number; planName: string} | null>(null);
  const [shareToCommunity, setShareToCommunity] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

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

  // 休息计时器
  useEffect(() => {
    if (timerRunning && restTimeLeft > 0) {
      const interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, restTimeLeft]);

  const startWorkout = (sessionIndex: number = 0) => {
    setCurrentSessionIndex(sessionIndex);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setRestTimeLeft(0);
    setTimerRunning(false);
    setWorkoutStartedAt(new Date().toISOString());
    setCompletedSets([]);
    setWorkoutMode(true);
  };

  const endWorkout = async () => {
    if (!workoutStartedAt || isSavingWorkout) {
      setWorkoutMode(false);
      return;
    }

    setIsSavingWorkout(true);

    const completedAt = new Date().toISOString();
    const durationSeconds = Math.floor((new Date(completedAt).getTime() - new Date(workoutStartedAt).getTime()) / 1000);

    // 计算总组数和次数
    const totalSets = completedSets.reduce((sum, ex) => sum + ex.sets, 0);
    const totalReps = completedSets.reduce((sum, ex) => sum + (ex.reps || 0) * ex.sets, 0);

    try {
      const response = await fetch('/api/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan?.id,
          sessionId: plan?.sessions[currentSessionIndex]?.session_number?.toString(),
          startedAt: workoutStartedAt,
          completedAt,
          durationSeconds,
          exercises: completedSets,
          totalSets,
          totalReps,
        }),
      });

      if (response.ok) {
        const workoutData = await response.json() as { id: string; newlyUnlocked?: string[] };

        // 记录新解锁的成就
        if (workoutData.newlyUnlocked && workoutData.newlyUnlocked.length > 0) {
          setNewlyUnlocked(workoutData.newlyUnlocked);
        }

        // 分享到社区
        if (shareToCommunity) {
          const planName = locale === 'zh' ? plan?.name : plan?.name_en;
          const durationMin = Math.round(durationSeconds / 60);
          const content = locale === 'zh'
            ? `💪 刚刚完成了 ${planName} 训练！\n⏱️ 时长: ${durationMin} 分钟\n🏋️ 共 ${totalSets} 组动作\n#健身打卡 #FitPlanPro`
            : `💪 Just completed ${planName}!\n⏱️ Duration: ${durationMin} min\n🏋️ ${totalSets} sets total\n#FitnessJourney #FitPlanPro`;

          await fetch('/api/community/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              post_type: 'workout',
              workout_id: workoutData.id,
              plan_id: plan?.id,
              workout_duration: durationMin,
              workout_sets: totalSets,
            }),
          });
        }

        // 显示完成界面
        setWorkoutStats({
          duration: Math.round(durationSeconds / 60),
          sets: totalSets,
          planName: locale === 'zh' ? (plan?.name || '训练') : (plan?.name_en || 'Workout'),
        });
        setWorkoutCompleted(true);
      } else {
        console.error('Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    setIsSavingWorkout(false);
    setWorkoutMode(false);
  };

  const nextSet = () => {
    const exercises = getExercises(currentSessionIndex);
    const currentExercise = exercises[currentExerciseIndex];

    // 记录完成的组
    setCompletedSets(prev => {
      const existing = prev.find(e => e.exerciseId === currentExercise?.exerciseId || e.name === currentExercise?.name);
      if (existing) {
        return prev.map(e => e.exerciseId === currentExercise?.exerciseId || e.name === currentExercise?.name
          ? { ...e, sets: e.sets + 1 }
          : e
        );
      } else {
        return [...prev, {
          exerciseId: currentExercise?.exerciseId || '',
          name: currentExercise?.name || '',
          sets: 1,
          reps: currentExercise?.reps || 0,
          weight: currentExercise?.weight,
        }];
      }
    });

    if (currentSet < currentExercise.sets) {
      // 开始休息
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimeLeft(currentExercise.restSeconds);
      setTimerRunning(true);
    } else {
      // 当前动作完成，进入下一个动作
      nextExercise();
    }
  };

  const nextExercise = () => {
    const exercises = getExercises(currentSessionIndex);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTimeLeft(0);
      setTimerRunning(false);
    } else {
      // 当前 session 完成
      if (currentSessionIndex < (plan?.sessions.length || 1) - 1) {
        setCurrentSessionIndex(prev => prev + 1);
        setCurrentExerciseIndex(0);
        setCurrentSet(1);
      } else {
        // 全部训练完成
        endWorkout();
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
    setTimerRunning(false);
  };

  const getExercises = (sessionIndex: number): Exercise[] => {
    if (!plan?.sessions[sessionIndex]) return [];
    try {
      return JSON.parse(plan.sessions[sessionIndex].exercises_json || '[]');
    } catch {
      return [];
    }
  };

  if (loading) {
    return <div className="container py-8 text-center">{locale === 'zh' ? '加载中...' : 'Loading...'}</div>;
  }

  if (error || !plan) {
    return <div className="container py-8 text-center text-red-500">{error || 'Not found'}</div>;
  }

  // 训练完成界面
  if (workoutCompleted && workoutStats) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="text-center">
          <CardContent className="py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {locale === 'zh' ? '🎉 训练完成！' : '🎉 Workout Complete!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {locale === 'zh' ? '太棒了！你完成了今天的训练。' : 'Great job! You completed your workout today.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold">{workoutStats.duration}</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '分钟' : 'minutes'}
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold">{workoutStats.sets}</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'zh' ? '组动作' : 'sets'}
                </div>
              </div>
            </div>

            {/* 新解锁成就 */}
            {newlyUnlocked.length > 0 && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-yellow-700">
                    {locale === 'zh' ? '🎉 新成就解锁！' : '🎉 New Achievement!'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newlyUnlocked.map(id => (
                    <Badge key={id} variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {locale === 'zh' ? getAchievementName(id, 'zh') : getAchievementName(id, 'en')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={() => {
                  setWorkoutCompleted(false);
                  setWorkoutStats(null);
                }}
              >
                {locale === 'zh' ? '返回计划' : 'Back to Plan'}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  window.location.href = `/${locale}/community`;
                }}
              >
                <Share2 className="w-4 h-4" />
                {locale === 'zh' ? '查看社区动态' : 'View Community'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 训练模式界面
  if (workoutMode) {
    const exercises = getExercises(currentSessionIndex);
    const currentExercise = exercises[currentExerciseIndex];
    const session = plan.sessions[currentSessionIndex];
    const progress = ((currentExerciseIndex * (currentExercise?.sets || 1) + currentSet) / (exercises.reduce((sum, ex) => sum + (ex.sets || 1), 0))) * 100;

    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{locale === 'zh' ? session.name : session.name_en}</h2>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={shareToCommunity}
                onChange={(e) => setShareToCommunity(e.target.checked)}
                className="rounded"
              />
              <Share2 className="w-4 h-4" />
              {locale === 'zh' ? '分享' : 'Share'}
            </label>
            <Button variant="outline" size="sm" onClick={endWorkout}>
              <X className="w-4 h-4 mr-1" />
              {locale === 'zh' ? '结束' : 'End'}
            </Button>
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        {isResting ? (
          <Card className="text-center py-8">
            <CardContent>
              <Clock className="w-16 h-16 mx-auto mb-4 text-primary" />
              <p className="text-4xl font-bold mb-2">{restTimeLeft}s</p>
              <p className="text-muted-foreground mb-4">
                {locale === 'zh' ? '休息时间' : 'Rest Time'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setTimerRunning(!timerRunning)}>
                  {timerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {timerRunning ? (locale === 'zh' ? '暂停' : 'Pause') : (locale === 'zh' ? '继续' : 'Resume')}
                </Button>
                <Button variant="outline" onClick={skipRest}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  {locale === 'zh' ? '跳过' : 'Skip'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{locale === 'zh' ? currentExercise?.name : currentExercise?.nameEn}</CardTitle>
                  <CardDescription>
                    {locale === 'zh' ? `第 ${currentSet} 组 / 共 ${currentExercise?.sets} 组` : `Set ${currentSet} of ${currentExercise?.sets}`}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {currentExercise?.reps ? `${currentExercise.reps} reps` : `${currentExercise?.duration}s`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-2xl font-bold mb-4">
                {currentExercise?.reps
                  ? `${currentExercise.reps} ${locale === 'zh' ? '次' : 'reps'}`
                  : `${currentExercise?.duration} ${locale === 'zh' ? '秒' : 'seconds'}`}
              </p>
              <Button size="lg" onClick={nextSet} className="w-full">
                <CheckCircle className="w-5 h-5 mr-2" />
                {locale === 'zh' ? '完成此组' : 'Complete Set'}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {locale === 'zh'
            ? `动作 ${currentExerciseIndex + 1}/${exercises.length}`
            : `Exercise ${currentExerciseIndex + 1}/${exercises.length}`}
        </div>
      </div>
    );
  }

  // 计划详情界面
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{locale === 'zh' ? plan.name : plan.name_en}</CardTitle>
              <CardDescription>{locale === 'zh' ? plan.description : plan.description_en}</CardDescription>
            </div>
            <Badge>{plan.difficulty}</Badge>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <span><Calendar className="w-4 h-4 inline mr-1" />{plan.duration_weeks} {locale === 'zh' ? '周' : 'weeks'}</span>
            <span><Dumbbell className="w-4 h-4 inline mr-1" />{plan.sessions_per_week} {locale === 'zh' ? '次/周' : 'sessions/wk'}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.sessions.map((s, idx) => {
            const exercises = JSON.parse(s.exercises_json || '[]');
            return (
              <div key={s.session_number} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{locale === 'zh' ? s.name : s.name_en}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground"><Clock className="w-4 h-4 inline mr-1" />{s.duration_minutes}min</span>
                    <Button size="sm" onClick={() => startWorkout(idx)}>
                      <Play className="w-3 h-3 mr-1" />
                      {locale === 'zh' ? '开始' : 'Start'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  {exercises.map((ex: Exercise, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{locale === 'zh' ? ex.name : ex.nameEn}</span>
                      <span className="text-muted-foreground">
                        {ex.sets}×{ex.reps || `${ex.duration}s`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}