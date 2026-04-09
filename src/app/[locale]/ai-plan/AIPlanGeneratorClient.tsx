// AI 训练计划生成客户端组件

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Sparkles, Loader2, Dumbbell, Clock, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { GeneratedPlan } from '@/lib/ai';

type Goal = 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance' | 'general';
type Level = 'beginner' | 'intermediate' | 'advanced';

export default function AIPlanGeneratorClient({ locale }: { locale: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('aiPlan');
  
  // 是否已登录（考虑加载状态）
  const isLoggedIn = status === 'authenticated' && session?.user;
  
  // 表单状态
  const [goal, setGoal] = useState<Goal>('general');
  const [fitnessLevel, setFitnessLevel] = useState<Level>('beginner');
  const [availableDays, setAvailableDays] = useState(3);
  const [sessionDuration, setSessionDuration] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(['none']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  
  // 器械选项
  const equipmentOptions = [
    { key: 'none', label: locale === 'zh' ? '徒手/无器械' : 'No Equipment' },
    { key: 'dumbbell', label: locale === 'zh' ? '哑铃' : 'Dumbbell' },
    { key: 'barbell', label: locale === 'zh' ? '杠铃' : 'Barbell' },
    { key: 'gym', label: locale === 'zh' ? '健身房全套' : 'Full Gym' },
    { key: 'home', label: locale === 'zh' ? '居家简易器械' : 'Home Equipment' },
  ];
  
  // 目标选项
  const goalOptions: Array<{ key: Goal; label: string; labelEn: string }> = [
    { key: 'general', label: '综合健身', labelEn: 'General Fitness' },
    { key: 'muscle_gain', label: '增肌塑形', labelEn: 'Muscle Gain' },
    { key: 'fat_loss', label: '减脂瘦身', labelEn: 'Fat Loss' },
    { key: 'strength', label: '力量提升', labelEn: 'Strength' },
    { key: 'endurance', label: '耐力提升', labelEn: 'Endurance' },
  ];
  
  // 水平选项
  const levelOptions: Array<{ key: Level; label: string; labelEn: string }> = [
    { key: 'beginner', label: '初学者', labelEn: 'Beginner' },
    { key: 'intermediate', label: '中级', labelEn: 'Intermediate' },
    { key: 'advanced', label: '高级', labelEn: 'Advanced' },
  ];
  
  // 保存计划到数据库
  const handleSavePlan = async () => {
    if (!generatedPlan || !isLoggedIn) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/plans/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedPlan),
      });
      
      const data = await response.json() as { success?: boolean; planId?: string; error?: string };
      
      if (response.ok && data.success) {
        setSavedPlanId(data.planId ?? null);
        router.push(`/${locale}/plans/${data.planId}`);
      } else {
        setError(data.error || 'Failed to save plan');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };
  const handleEquipmentChange = (key: string) => {
    if (key === 'none') {
      setEquipment(['none']);
    } else {
      setEquipment(prev => {
        const filtered = prev.filter(e => e !== 'none');
        if (filtered.includes(key)) {
          return filtered.filter(e => e !== key);
        }
        return [...filtered, key];
      });
    }
  };
  
  // 生成计划
  const handleGenerate = async () => {
    // 如果正在加载 session，等待
    if (status === 'loading') {
      return;
    }
    
    // 未登录则跳转登录页
    if (!isLoggedIn) {
      router.push(`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/ai-plan`)}`);
      return;
    }
    
    setLoading(true);
    setError(null);
    setGeneratedPlan(null);
    
    try {
      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          fitnessLevel,
          availableDays,
          sessionDuration,
          equipment,
          language: locale === 'zh' ? 'zh' : 'en',
        }),
      });
      
      const data = await response.json() as { success?: boolean; plan?: GeneratedPlan; error?: string };
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }
      
      setGeneratedPlan(data.plan!);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {locale === 'zh' ? 'AI 智能训练计划生成' : 'AI Workout Plan Generator'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'zh' 
            ? '根据你的目标、水平和条件，生成专属训练计划' 
            : 'Generate a personalized workout plan based on your goals and conditions'}
        </p>
      </div>
      
      {/* Generator Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            <Target className="w-5 h-5 mr-2 inline" />
            {locale === 'zh' ? '设置你的训练参数' : 'Set Your Training Parameters'}
          </CardTitle>
          <CardDescription>
            {locale === 'zh' 
              ? 'AI 会根据这些信息为你定制最适合的计划' 
              : 'AI will customize the best plan based on this information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {locale === 'zh' ? '训练目标' : 'Training Goal'}
            </label>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map(opt => (
                <Button
                  key={opt.key}
                  variant={goal === opt.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGoal(opt.key)}
                >
                  {locale === 'zh' ? opt.label : opt.labelEn}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Fitness Level */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {locale === 'zh' ? '健身水平' : 'Fitness Level'}
            </label>
            <div className="flex gap-2">
              {levelOptions.map(opt => (
                <Button
                  key={opt.key}
                  variant={fitnessLevel === opt.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFitnessLevel(opt.key)}
                >
                  {locale === 'zh' ? opt.label : opt.labelEn}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Available Days */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {locale === 'zh' ? '每周训练天数' : 'Days per Week'}: {availableDays}
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5, 6].map(d => (
                <Button
                  key={d}
                  variant={availableDays === d ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAvailableDays(d)}
                  className="w-10"
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Session Duration */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {locale === 'zh' ? '每次训练时长' : 'Session Duration'}: {sessionDuration} {locale === 'zh' ? '分钟' : 'min'}
            </label>
            <div className="flex gap-2 items-center">
              {[30, 45, 60, 75, 90].map(d => (
                <Button
                  key={d}
                  variant={sessionDuration === d ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSessionDuration(d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Equipment */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {locale === 'zh' ? '可用器械' : 'Available Equipment'}
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(opt => (
                <Button
                  key={opt.key}
                  variant={equipment.includes(opt.key) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleEquipmentChange(opt.key)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {locale === 'zh' ? '正在生成...' : 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {locale === 'zh' ? '生成训练计划' : 'Generate Workout Plan'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Error Display */}
      {error && (
        <Card className="mb-8 border-destructive">
          <CardContent className="flex items-center gap-2 py-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">{error}</span>
          </CardContent>
        </Card>
      )}
      
      {/* Generated Plan Display */}
      {generatedPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {locale === 'zh' ? generatedPlan.name : generatedPlan.nameEn}
                </CardTitle>
                <CardDescription>
                  {locale === 'zh' ? generatedPlan.description : generatedPlan.descriptionEn}
                </CardDescription>
              </div>
              <Badge>{locale === 'zh' ? generatedPlan.difficulty : generatedPlan.difficulty}</Badge>
            </div>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span><Clock className="w-4 h-4 inline mr-1" />{generatedPlan.durationWeeks} {locale === 'zh' ? '周' : 'weeks'}</span>
              <span><Dumbbell className="w-4 h-4 inline mr-1" />{generatedPlan.sessionsPerWeek} {locale === 'zh' ? '次/周' : 'sessions/week'}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPlan.sessions.map(session => (
              <div key={session.sessionNumber} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">
                    {locale === 'zh' ? session.name : session.nameEn}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {session.durationMinutes} {locale === 'zh' ? '分钟' : 'min'}
                  </span>
                </div>
                <div className="space-y-2">
                  {session.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{locale === 'zh' ? ex.name : ex.nameEn}</span>
                      <span className="text-muted-foreground">
                        {ex.sets} × {ex.reps} ({ex.restSeconds}s {locale === 'zh' ? '休息' : 'rest'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Save Plan Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSavePlan}
              disabled={saving || savedPlanId !== null}
            >
              {saving 
                ? (locale === 'zh' ? '保存中...' : 'Saving...')
                : savedPlanId
                  ? (locale === 'zh' ? '已保存 ✓' : 'Saved ✓')
                  : (locale === 'zh' ? '保存此计划' : 'Save This Plan')
              }
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}