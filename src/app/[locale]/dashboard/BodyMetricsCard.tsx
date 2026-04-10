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
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, TrendingUp, TrendingDown, Minus, Plus, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { BodyMetricsForm } from './BodyMetricsForm';

interface BodyMetric {
  id: string;
  weight: number | null;
  body_fat: number | null;
  height: number | null;
  chest: number | null;
  waist: number | null;
  hip: number | null;
  arm: number | null;
  thigh: number | null;
  recorded_at: string;
}

interface BodyMetricsResponse {
  metrics: BodyMetric[];
  latest: BodyMetric | null;
}

interface BodyMetricsCardProps {
  locale: string;
}

export function BodyMetricsCard({ locale }: BodyMetricsCardProps) {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [latest, setLatest] = useState<BodyMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllMeasurements, setShowAllMeasurements] = useState(false);
  const isZh = locale === 'zh';

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/body-metrics?days=90');
      const data = (await response.json()) as BodyMetricsResponse;
      setMetrics(data.metrics || []);
      setLatest(data.latest);
    } catch (error) {
      console.error('Failed to fetch body metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // 准备图表数据
  const chartData = metrics
    .filter((m) => m.weight !== null || m.body_fat !== null)
    .reverse()
    .map((m) => ({
      date: new Date(m.recorded_at).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: m.weight,
      bodyFat: m.body_fat,
    }));

  // 计算体重变化趋势
  const getWeightTrend = () => {
    if (metrics.length < 2 || !latest?.weight) return null;
    const prev = metrics[1]?.weight;
    if (!prev) return null;
    const diff = (latest.weight - prev) as number;
    if (Math.abs(diff) < 0.1) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const weightTrend = getWeightTrend();

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-48 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 无数据时显示引导
  if (metrics.length === 0) {
    return (
      <Card className="mb-8 border-dashed">
        <CardContent className="py-8 text-center">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isZh ? '开始记录身体数据' : 'Start Tracking Your Body Metrics'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isZh
              ? '记录体重、体脂等数据，追踪您的健身进度'
              : 'Record weight, body fat, and more to track your fitness progress'}
          </p>
          <BodyMetricsForm locale={locale} onSuccess={fetchMetrics} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span>{isZh ? '身体数据' : 'Body Metrics'}</span>
          </div>
          <BodyMetricsForm
            locale={locale}
            onSuccess={fetchMetrics}
            trigger={
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                {isZh ? '记录' : 'Record'}
              </Button>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 最新数据展示 */}
        {latest && (
          <div className="space-y-4 mb-6">
            {/* 主要数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latest.weight !== null && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Scale className="h-3 w-3" />
                    {isZh ? '体重' : 'Weight'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{latest.weight}</span>
                    <span className="text-sm text-muted-foreground">kg</span>
                    {weightTrend && (
                      weightTrend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : weightTrend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )
                    )}
                  </div>
                </div>
              )}
              {latest.body_fat !== null && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Activity className="h-3 w-3" />
                    {isZh ? '体脂率' : 'Body Fat'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{latest.body_fat}</span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              )}
              {latest.waist !== null && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-muted-foreground text-sm">{isZh ? '腰围' : 'Waist'}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{latest.waist}</span>
                    <span className="text-sm text-muted-foreground">cm</span>
                  </div>
                </div>
              )}
              {latest.height !== null && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-muted-foreground text-sm">{isZh ? '身高' : 'Height'}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{latest.height}</span>
                    <span className="text-sm text-muted-foreground">cm</span>
                  </div>
                </div>
              )}
            </div>

            {/* 围度数据（可展开） */}
            {(latest.chest !== null || latest.hip !== null || latest.arm !== null || latest.thigh !== null) && (
              <div>
                <button
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowAllMeasurements(!showAllMeasurements)}
                >
                  {showAllMeasurements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {isZh ? '围度数据' : 'Measurements'}
                </button>
                {showAllMeasurements && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    {latest.chest !== null && (
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-muted-foreground text-xs">{isZh ? '胸围' : 'Chest'}</div>
                        <span className="text-lg font-semibold">{latest.chest} cm</span>
                      </div>
                    )}
                    {latest.hip !== null && (
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-muted-foreground text-xs">{isZh ? '臀围' : 'Hip'}</div>
                        <span className="text-lg font-semibold">{latest.hip} cm</span>
                      </div>
                    )}
                    {latest.arm !== null && (
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-muted-foreground text-xs">{isZh ? '臂围' : 'Arm'}</div>
                        <span className="text-lg font-semibold">{latest.arm} cm</span>
                      </div>
                    )}
                    {latest.thigh !== null && (
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-muted-foreground text-xs">{isZh ? '大腿围' : 'Thigh'}</div>
                        <span className="text-lg font-semibold">{latest.thigh} cm</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 趋势图 */}
        {chartData.length > 1 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis
                  yAxisId="weight"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  orientation="left"
                />
                <YAxis
                  yAxisId="bodyFat"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  orientation="right"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'weight'
                      ? `${value} kg`
                      : `${value}%`,
                    name === 'weight'
                      ? (isZh ? '体重' : 'Weight')
                      : (isZh ? '体脂率' : 'Body Fat'),
                  ]}
                />
                <Legend
                  formatter={(value: string) =>
                    value === 'weight'
                      ? (isZh ? '体重' : 'Weight')
                      : (isZh ? '体脂率' : 'Body Fat')
                  }
                />
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  connectNulls
                />
                <Line
                  yAxisId="bodyFat"
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142 76% 36%)', strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 数据点数量 */}
        <div className="mt-4 text-center">
          <Badge variant="secondary">
            {isZh
              ? `共 ${metrics.length} 条记录`
              : `${metrics.length} records`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}