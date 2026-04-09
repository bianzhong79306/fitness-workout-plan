// 计划详情客户端组件

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dumbbell, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export default function PlanDetailClient({ locale, planId }: { locale: string; planId: string }) {
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  if (loading) {
    return <div className="container py-8 text-center">{locale === 'zh' ? '加载中...' : 'Loading...'}</div>;
  }
  
  if (error || !plan) {
    return <div className="container py-8 text-center text-red-500">{error || 'Not found'}</div>;
  }
  
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
          {plan.sessions.map(s => {
            const exercises = JSON.parse(s.exercises_json || '[]');
            return (
              <div key={s.session_number} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{locale === 'zh' ? s.name : s.name_en}</h3>
                  <span className="text-sm text-muted-foreground"><Clock className="w-4 h-4 inline mr-1" />{s.duration_minutes}min</span>
                </div>
                <div className="space-y-1">
                  {exercises.map((ex: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{locale === 'zh' ? ex.name : ex.nameEn}</span>
                      <span className="text-muted-foreground">{ex.sets}×{ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          <Button className="w-full" size="lg">
            <CheckCircle className="w-4 h-4 mr-2" />
            {locale === 'zh' ? '开始训练' : 'Start Workout'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}