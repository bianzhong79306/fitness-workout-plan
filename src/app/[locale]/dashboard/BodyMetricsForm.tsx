'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Percent, Ruler, Save, X } from 'lucide-react';

interface BodyMetricsFormProps {
  locale: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function BodyMetricsForm({ locale, onSuccess, trigger }: BodyMetricsFormProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [arm, setArm] = useState('');
  const [thigh, setThigh] = useState('');
  const [hip, setHip] = useState('');

  const isZh = locale === 'zh';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/body-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : undefined,
          bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
          height: height ? parseFloat(height) : undefined,
          waist: waist ? parseFloat(waist) : undefined,
          chest: chest ? parseFloat(chest) : undefined,
          arm: arm ? parseFloat(arm) : undefined,
          thigh: thigh ? parseFloat(thigh) : undefined,
          hip: hip ? parseFloat(hip) : undefined,
        }),
      });

      if (response.ok) {
        setOpen(false);
        // 清空表单
        setWeight('');
        setBodyFat('');
        setHeight('');
        setWaist('');
        setChest('');
        setArm('');
        setThigh('');
        setHip('');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Failed to save body metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border rounded-md bg-background";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Scale className="h-4 w-4" />
            {isZh ? '记录数据' : 'Record Data'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            {isZh ? '记录身体数据' : 'Record Body Metrics'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* 基础数据 */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Scale className="h-3 w-3" />
                    {isZh ? '体重 (kg)' : 'Weight (kg)'}
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="70.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {isZh ? '体脂率 (%)' : 'Body Fat (%)'}
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="15.0"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  {isZh ? '身高 (cm)' : 'Height (cm)'}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="175.0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 围度数据（可选） */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {isZh ? '围度测量（可选）' : 'Measurements (Optional)'}
            </summary>
            <CardContent className="pt-3 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {isZh ? '胸围 (cm)' : 'Chest (cm)'}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="100"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {isZh ? '腰围 (cm)' : 'Waist (cm)'}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="80"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {isZh ? '臀围 (cm)' : 'Hip (cm)'}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="95"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {isZh ? '臂围 (cm)' : 'Arm (cm)'}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="35"
                  value={arm}
                  onChange={(e) => setArm(e.target.value)}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs text-muted-foreground">
                  {isZh ? '大腿围 (cm)' : 'Thigh (cm)'}
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="55"
                  value={thigh}
                  onChange={(e) => setThigh(e.target.value)}
                />
              </div>
            </CardContent>
          </details>

          {/* 按钮 */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              {isZh ? '取消' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-1" />
              {loading
                ? (isZh ? '保存中...' : 'Saving...')
                : (isZh ? '保存' : 'Save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}