'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Dumbbell, TrendingUp, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface ProgressRecord {
  id: string;
  exercise_id: string;
  weight: number | null;
  reps: number | null;
  sets: number | null;
  one_rep_max: number | null;
  notes: string | null;
  recorded_at: string;
}

interface ExerciseSummary {
  exercise_id: string;
  max_weight: number;
  max_one_rep_max: number;
  total_records: number;
  latest_record: ProgressRecord | null;
  progress_history: ProgressRecord[];
}

interface StrengthProgressCardProps {
  locale: string;
}

// 动作名称映射
const exerciseNames: Record<string, { zh: string; en: string }> = {
  'push-up': { zh: '俯卧撑', en: 'Push-up' },
  'squat': { zh: '深蹲', en: 'Squat' },
  'deadlift': { zh: '硬拉', en: 'Deadlift' },
  'bench-press': { zh: '卧推', en: 'Bench Press' },
  'pull-up': { zh: '引体向上', en: 'Pull-up' },
  'overhead-press': { zh: '肩推', en: 'Overhead Press' },
  'barbell-row': { zh: '杠铃划船', en: 'Barbell Row' },
  'lunge': { zh: '弓步蹲', en: 'Lunge' },
  'plank': { zh: '平板支撑', en: 'Plank' },
  'dumbbell-curl': { zh: '哑铃弯举', en: 'Dumbbell Curl' },
};

export function StrengthProgressCard({ locale }: StrengthProgressCardProps) {
  const [summaries, setSummaries] = useState<ExerciseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // 表单状态
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const isZh = locale === 'zh';

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/exercise-progress?days=90');
      if (response.ok) {
        const data = await response.json() as { summaries: ExerciseSummary[] };
        setSummaries(data.summaries || []);
      }
    } catch (error) {
      console.error('Failed to fetch strength progress:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async () => {
    if (!selectedExercise || !weight || !reps) return;

    setSaving(true);
    try {
      const response = await fetch('/api/exercise-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_id: selectedExercise,
          weight: parseFloat(weight),
          reps: parseInt(reps),
          sets: 1,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        setDialogOpen(false);
        setWeight('');
        setReps('');
        setNotes('');
        setSelectedExercise('');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const name = exerciseNames[exerciseId];
    if (name) return isZh ? name.zh : name.en;
    return exerciseId;
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="animate-pulse h-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  // 无数据时显示引导
  if (summaries.length === 0) {
    return (
      <Card className="mb-8 border-dashed">
        <CardContent className="py-8 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isZh ? '开始追踪力量进步' : 'Start Tracking Strength Progress'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isZh
              ? '记录您的训练重量，追踪力量进步曲线'
              : 'Record your training weights to track strength progress'}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                {isZh ? '记录力量数据' : 'Record Strength'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isZh ? '记录力量数据' : 'Record Strength Progress'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    {isZh ? '选择动作' : 'Select Exercise'}
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                  >
                    <option value="">{isZh ? '请选择...' : 'Select...'}</option>
                    {Object.entries(exerciseNames).map(([id, name]) => (
                      <option key={id} value={id}>
                        {isZh ? name.zh : name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {isZh ? '重量 (kg)' : 'Weight (kg)'}
                    </label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {isZh ? '次数' : 'Reps'}
                    </label>
                    <Input
                      type="number"
                      placeholder="8"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">{isZh ? '取消' : 'Cancel'}</Button>
                  </DialogClose>
                  <Button onClick={handleSubmit} disabled={saving || !selectedExercise || !weight || !reps}>
                    {saving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存' : 'Save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>{isZh ? '力量进步' : 'Strength Progress'}</span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                {isZh ? '记录' : 'Record'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isZh ? '记录力量数据' : 'Record Strength Progress'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    {isZh ? '选择动作' : 'Select Exercise'}
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                  >
                    <option value="">{isZh ? '请选择...' : 'Select...'}</option>
                    {Object.entries(exerciseNames).map(([id, name]) => (
                      <option key={id} value={id}>
                        {isZh ? name.zh : name.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      {isZh ? '重量 (kg)' : 'Weight (kg)'}
                    </label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {isZh ? '次数' : 'Reps'}
                    </label>
                    <Input
                      type="number"
                      placeholder="8"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">{isZh ? '取消' : 'Cancel'}</Button>
                  </DialogClose>
                  <Button onClick={handleSubmit} disabled={saving || !selectedExercise || !weight || !reps}>
                    {saving ? (isZh ? '保存中...' : 'Saving...') : (isZh ? '保存' : 'Save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaries.map((summary) => {
            const isExpanded = expandedExercise === summary.exercise_id;
            const hasHistory = summary.progress_history.length > 1;

            return (
              <div key={summary.exercise_id} className="border rounded-lg">
                {/* 摘要头部 */}
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => hasHistory && setExpandedExercise(isExpanded ? null : summary.exercise_id)}
                >
                  <div className="flex items-center gap-3">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">
                        {getExerciseName(summary.exercise_id)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isZh ? `${summary.total_records} 条记录` : `${summary.total_records} records`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {summary.max_weight} kg
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? '最大重量' : 'Max Weight'}
                      </div>
                    </div>
                    {hasHistory && (
                      isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* 展开的图表 */}
                {isExpanded && hasHistory && (
                  <div className="p-4 pt-0 border-t">
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={summary.progress_history
                            .slice()
                            .reverse()
                            .map((r) => ({
                              date: new Date(r.recorded_at).toLocaleDateString(
                                isZh ? 'zh-CN' : 'en-US',
                                { month: 'short', day: 'numeric' }
                              ),
                              weight: r.weight,
                              oneRepMax: r.one_rep_max,
                            }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    {summary.latest_record?.one_rep_max && (
                      <div className="mt-2 text-center">
                        <Badge variant="secondary">
                          1RM: {summary.latest_record.one_rep_max.toFixed(1)} kg
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}