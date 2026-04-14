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
    <div className="min-h-screen">
      {/* 活力Hero区域 */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500">
        {/* 光晕装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-300/30 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">{locale === 'zh' ? "智能生成个性化计划" : "Generate Personalized Plan"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            {locale === 'zh' ? 'AI 训练计划生成' : 'AI Plan Generator'}
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {locale === 'zh' ? '根据您的目标、水平、器械，智能生成专属训练计划' : 'Generate your personalized workout plan based on goals, level, and equipment'}
          </p>
        </div>
      </section>
      
      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
      
      <Card className="mb-8 border-2 border-violet-500/20 shadow-xl">
        <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-t-lg" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-500" />
            {locale === 'zh' ? '设置参数' : 'Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal */}
          <div>
            <label className="text-sm font-medium mb-3 block">{locale === 'zh' ? '目标' : 'Goal'}</label>
            <div className="flex flex-wrap gap-2">
              {(['general', 'muscle_gain', 'fat_loss', 'strength', 'endurance'] as Goal[]).map(g => (
                <Button key={g} className={goal === g ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full" : "rounded-full"} variant={goal === g ? 'default' : 'outline'} size="sm" onClick={() => setGoal(g)}>
                  {goalLabels[g]}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Level */}
          <div>
            <label className="text-sm font-medium mb-3 block">{locale === 'zh' ? '水平' : 'Level'}</label>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced'] as Level[]).map(l => (
                <Button key={l} className={fitnessLevel === l ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full" : "rounded-full"} variant={fitnessLevel === l ? 'default' : 'outline'} size="sm" onClick={() => setFitnessLevel(l)}>
                  {levelLabels[l]}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Days */}
          <div>
            <label className="text-sm font-medium mb-3 block">{locale === 'zh' ? '每周天数' : 'Days/Week'}: <span className="font-bold text-violet-600">{availableDays}</span></label>
            <div className="flex gap-1">
              {[1,2,3,4,5,6].map(d => (
                <Button key={d} className={availableDays === d ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full w-10" : "rounded-full w-10"} variant={availableDays === d ? 'default' : 'outline'} size="sm" onClick={() => setAvailableDays(d)}>{d}</Button>
              ))}
            </div>
          </div>
          
          {/* Duration */}
          <div>
            <label className="text-sm font-medium mb-3 block">{locale === 'zh' ? '每次时长' : 'Duration'}: <span className="font-bold text-violet-600">{sessionDuration}</span>min</label>
            <div className="flex gap-2">
              {[30,45,60,90].map(d => (
                <Button key={d} className={sessionDuration === d ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full" : "rounded-full"} variant={sessionDuration === d ? 'default' : 'outline'} size="sm" onClick={() => setSessionDuration(d)}>{d}</Button>
              ))}
            </div>
          </div>
          
          {/* Equipment */}
          <div>
            <label className="text-sm font-medium mb-3 block">{locale === 'zh' ? '器械' : 'Equipment'}</label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(e => (
                <Button key={e.key} className={equipment.includes(e.key) ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full" : "rounded-full"} variant={equipment.includes(e.key) ? 'default' : 'outline'} size="sm" onClick={() => handleEquipment(e.key)}>
                  {e.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <Button className="w-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white rounded-full shadow-lg text-lg py-6" size="lg" onClick={handleGenerate} disabled={loading}>
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{locale === 'zh' ? '生成中...' : 'Generating...'}</>
              : <><Sparkles className="w-5 h-5 mr-2 animate-pulse" />{locale === 'zh' ? '生成计划' : 'Generate Plan'}</>}
          </Button>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="mb-8 border-2 border-red-500/20">
          <CardContent className="flex items-center gap-2 py-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-600">{error}</span>
          </CardContent>
        </Card>
      )}
      
      {generatedPlan && (
        <Card className="border-2 border-green-500/20 shadow-xl">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-lg" />
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">{locale === 'zh' ? generatedPlan.name : generatedPlan.nameEn}</CardTitle>
                <CardDescription className="mt-2">{locale === 'zh' ? generatedPlan.description : generatedPlan.descriptionEn}</CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">{generatedPlan.difficulty}</Badge>
            </div>
            <div className="flex gap-4 text-sm mt-4">
              <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700"><Clock className="w-4 h-4 inline mr-1" />{generatedPlan.durationWeeks} {locale === 'zh' ? '周' : 'wks'}</span>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700"><Dumbbell className="w-4 h-4 inline mr-1" />{generatedPlan.sessionsPerWeek} {locale === 'zh' ? '次' : 'ses'}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedPlan.sessions.map(s => (
              <div key={s.sessionNumber} className="border-2 border-violet-200 rounded-lg p-4 bg-gradient-to-br from-violet-50 to-purple-50">
                <div className="flex justify-between mb-3">
                  <h3 className="font-bold text-violet-700">{locale === 'zh' ? s.name : s.nameEn}</h3>
                  <span className="text-sm text-violet-500 font-medium">{s.durationMinutes}min</span>
                </div>
                <div className="space-y-2">
                  {s.exercises.map((ex, i) => (
                    <div key={i} className="flex justify-between text-sm bg-white/50 rounded px-2 py-1">
                      <span className="font-medium">{locale === 'zh' ? ex.name : ex.nameEn}</span>
                      <span className="text-violet-600">{ex.sets}×{ex.reps} ({ex.restSeconds}s)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg text-lg py-6" onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{locale === 'zh' ? '保存中...' : 'Saving...'}</>
                : <><CheckCircle className="w-5 h-5 mr-2" />{locale === 'zh' ? '开始此计划' : 'Start This Plan'}</>}
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}