// AI 训练计划生成客户端组件 - 简化版

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Dumbbell, Clock, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Goal = 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance' | 'general';
type Level = 'beginner' | 'intermediate' | 'advanced';

interface GeneratedPlan {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  goal: string;
  difficulty: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessions: Array<{
    sessionNumber: number;
    name: string;
    nameEn: string;
    durationMinutes: number;
    exercises: Array<{
      name: string;
      nameEn: string;
      sets: number;
      reps: string;
      restSeconds: number;
    }>;
  }>;
}

export default function AIPlanGeneratorClient({ locale }: { locale: string }) {
  const router = useRouter();
  
  const [goal, setGoal] = useState<Goal>('general');
  const [fitnessLevel, setFitnessLevel] = useState<Level>('beginner');
  const [availableDays, setAvailableDays] = useState(3);
  const [sessionDuration, setSessionDuration] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(['none']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [saving, setSaving] = useState(false);
  
  const goalLabels = {
    general: locale === 'zh' ? '综合健身' : 'General',
    muscle_gain: locale === 'zh' ? '增肌' : 'Muscle Gain',
    fat_loss: locale === 'zh' ? '减脂' : 'Fat Loss',
    strength: locale === 'zh' ? '力量' : 'Strength',
    endurance: locale === 'zh' ? '耐力' : 'Endurance',
  };
  
  const levelLabels = {
    beginner: locale === 'zh' ? '初级' : 'Beginner',
    intermediate: locale === 'zh' ? '中级' : 'Intermediate',
    advanced: locale === 'zh' ? '高级' : 'Advanced',
  };
  
  const equipmentOptions = [
    { key: 'none', label: locale === 'zh' ? '徒手' : 'Bodyweight' },
    { key: 'dumbbell', label: locale === 'zh' ? '哑铃' : 'Dumbbell' },
    { key: 'barbell', label: locale === 'zh' ? '杠铃' : 'Barbell' },
    { key: 'gym', label: locale === 'zh' ? '健身房' : 'Full Gym' },
  ];
  
  const handleEquipment = (key: string) => {
    if (key === 'none') {
      setEquipment(['none']);
    } else {
      setEquipment(prev => prev.includes('none') ? [key] : 
        prev.includes(key) ? prev.filter(e => e !== key) : [...prev, key]);
    }
  };
  
  // 生成计划
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal, fitnessLevel, availableDays, sessionDuration, equipment,
          language: locale === 'zh' ? 'zh' : 'en',
        }),
      });
      
      const data = await res.json() as { success?: boolean; plan?: GeneratedPlan; error?: string };
      
      if (!res.ok || !data.success) {
        // 如果是未登录错误，跳转登录页
        if (res.status === 401) {
          router.push(`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/ai-plan`)}`);
          return;
        }
        throw new Error(data.error || 'Failed');
      }
      
      setGeneratedPlan(data.plan!);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };
  
  // 保存计划
  const handleSave = async () => {
    if (!generatedPlan) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/plans/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedPlan),
      });
      
      const data = await res.json() as { success?: boolean; planId?: string; error?: string };
      
      if (res.ok && data.success && data.planId) {
        router.push(`/${locale}/plans/${data.planId}`);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">
          {locale === 'zh' ? 'AI 训练计划生成' : 'AI Plan Generator'}
        </h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{locale === 'zh' ? '设置参数' : 'Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal */}
          <div>
            <label className="text-sm font-medium mb-2 block">{locale === 'zh' ? '目标' : 'Goal'}</label>
            <div className="flex gap-2">
              {(['general', 'muscle_gain', 'fat_loss', 'strength', 'endurance'] as Goal[]).map(g => (
                <Button key={g} variant={goal === g ? 'default' : 'outline'} size="sm" onClick={() => setGoal(g)}>
                  {goalLabels[g]}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Level */}
          <div>
            <label className="text-sm font-medium mb-2 block">{locale === 'zh' ? '水平' : 'Level'}</label>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced'] as Level[]).map(l => (
                <Button key={l} variant={fitnessLevel === l ? 'default' : 'outline'} size="sm" onClick={() => setFitnessLevel(l)}>
                  {levelLabels[l]}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Days */}
          <div>
            <label className="text-sm font-medium mb-2 block">{locale === 'zh' ? '每周天数' : 'Days/Week'}: {availableDays}</label>
            <div className="flex gap-1">
              {[1,2,3,4,5,6].map(d => (
                <Button key={d} variant={availableDays === d ? 'default' : 'outline'} size="sm" className="w-8" onClick={() => setAvailableDays(d)}>{d}</Button>
              ))}
            </div>
          </div>
          
          {/* Duration */}
          <div>
            <label className="text-sm font-medium mb-2 block">{locale === 'zh' ? '每次时长' : 'Duration'}: {sessionDuration}min</label>
            <div className="flex gap-2">
              {[30,45,60,90].map(d => (
                <Button key={d} variant={sessionDuration === d ? 'default' : 'outline'} size="sm" onClick={() => setSessionDuration(d)}>{d}</Button>
              ))}
            </div>
          </div>
          
          {/* Equipment */}
          <div>
            <label className="text-sm font-medium mb-2 block">{locale === 'zh' ? '器械' : 'Equipment'}</label>
            <div className="flex gap-2">
              {equipmentOptions.map(e => (
                <Button key={e.key} variant={equipment.includes(e.key) ? 'default' : 'outline'} size="sm" onClick={() => handleEquipment(e.key)}>
                  {e.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <Button className="w-full" size="lg" onClick={handleGenerate} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{locale === 'zh' ? '生成中...' : 'Generating...'}</>
              : <><Sparkles className="w-4 h-4 mr-2" />{locale === 'zh' ? '生成计划' : 'Generate Plan'}</>}
          </Button>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="mb-8 border-destructive">
          <CardContent className="flex items-center gap-2 py-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}
      
      {generatedPlan && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{locale === 'zh' ? generatedPlan.name : generatedPlan.nameEn}</CardTitle>
                <CardDescription>{locale === 'zh' ? generatedPlan.description : generatedPlan.descriptionEn}</CardDescription>
              </div>
              <Badge>{generatedPlan.difficulty}</Badge>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <span><Clock className="w-4 h-4 inline mr-1" />{generatedPlan.durationWeeks} {locale === 'zh' ? '周' : 'wks'}</span>
              <span><Dumbbell className="w-4 h-4 inline mr-1" />{generatedPlan.sessionsPerWeek} {locale === 'zh' ? '次/周' : 'sessions/wk'}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPlan.sessions.map(s => (
              <div key={s.sessionNumber} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{locale === 'zh' ? s.name : s.nameEn}</h3>
                  <span className="text-sm text-muted-foreground">{s.durationMinutes}min</span>
                </div>
                <div className="space-y-1">
                  {s.exercises.map((ex, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{locale === 'zh' ? ex.name : ex.nameEn}</span>
                      <span className="text-muted-foreground">{ex.sets}×{ex.reps} ({ex.restSeconds}s)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{locale === 'zh' ? '保存中...' : 'Saving...'}</>
                : <><CheckCircle className="w-4 h-4 mr-2" />{locale === 'zh' ? '开始此计划' : 'Start This Plan'}</>}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}