"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exercises } from "@/data/exercises";
import { muscleGroupOptions, difficultyOptions } from "@/types/exercise";
import { Dumbbell, Clock, ChevronDown, ChevronUp, Filter, Flame, Activity, Target, Zap, ArrowRight } from "lucide-react";

interface ExercisesClientProps {
  locale: string;
}

export default function ExercisesClient({ locale }: ExercisesClientProps) {
  const isZh = locale === "zh";
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // 按肌群分组
  const groupedExercises = muscleGroupOptions.map((group) => {
    let filtered = exercises.filter((e) => e.muscles.includes(group.value));
    if (selectedDifficulty) {
      filtered = filtered.filter((e) => e.difficulty === selectedDifficulty);
    }
    return {
      ...group,
      exercises: filtered,
    };
  });

  const toggleGroup = (groupValue: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupValue)) {
      newExpanded.delete(groupValue);
    } else {
      newExpanded.add(groupValue);
    }
    setExpandedGroups(newExpanded);
  };

  const getDifficultyBadge = (difficulty: string) => {
    const label = isZh
      ? difficultyOptions.find(d => d.value === difficulty)?.label || difficulty
      : difficultyOptions.find(d => d.value === difficulty)?.labelEn || difficulty;
    
    const colors: Record<string, string> = {
      beginner: 'from-green-500 to-emerald-500',
      intermediate: 'from-blue-500 to-indigo-500',
      advanced: 'from-purple-500 to-pink-500',
    };
    
    return { label, color: colors[difficulty] || 'from-gray-500 to-gray-600' };
  };

  const getEquipmentLabel = (equipment: string) => {
    const labels: Record<string, { zh: string; en: string }> = {
      none: { zh: "徒手", en: "No equipment" },
      chair: { zh: "椅子", en: "Chair" },
      wall: { zh: "墙壁", en: "Wall" },
      doorframe: { zh: "门框", en: "Doorframe" },
      towel: { zh: "毛巾", en: "Towel" },
      table: { zh: "桌子", en: "Table" },
      dumbbell: { zh: "哑铃", en: "Dumbbell" },
      barbell: { zh: "杠铃", en: "Barbell" },
      gym: { zh: "健身房", en: "Gym" },
      bar: { zh: "单杠", en: "Bar" },
      dip_bar: { zh: "双杠", en: "Dip bar" },
      ab_wheel: { zh: "健腹轮", en: "Ab wheel" },
    };
    return isZh ? labels[equipment]?.zh || equipment : labels[equipment]?.en || equipment;
  };

  const muscleColors: Record<string, string> = {
    chest: 'from-red-500 to-orange-500',
    back: 'from-blue-500 to-indigo-500',
    shoulders: 'from-purple-500 to-pink-500',
    biceps: 'from-green-500 to-emerald-500',
    triceps: 'from-cyan-500 to-teal-500',
    core: 'from-yellow-500 to-orange-500',
    legs: 'from-rose-500 to-red-500',
    glutes: 'from-pink-500 to-rose-500',
  };

  // 计算总数
  const totalFiltered = selectedDifficulty 
    ? exercises.filter(e => e.difficulty === selectedDifficulty).length 
    : exercises.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero 区域 */}
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container relative z-10 py-12 md:py-16">
          {/* 标题 */}
          <div className="text-center mb-8 slide-in-up">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
              <Dumbbell className="w-5 h-5 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {isZh ? '专业动作 · 详细教学' : 'Professional Exercises · Detailed Instructions'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isZh ? '动作百科' : 'Exercise Library'}
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {isZh
                ? `${totalFiltered} 个专业训练动作，详细教学，分类清晰`
                : `${totalFiltered} professional exercises, detailed instructions, clear categories`}
            </p>
            
            {/* 统计 */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <div className="stats-card px-6 py-3 rounded-full">
                <span className="font-bold text-blue-600">{totalFiltered}</span>
                <span className="text-sm ml-2 text-slate-600">{isZh ? '个动作' : 'exercises'}</span>
              </div>
              <div className="stats-card px-6 py-3 rounded-full">
                <span className="font-bold text-indigo-600">{muscleGroupOptions.length}</span>
                <span className="text-sm ml-2 text-slate-600">{isZh ? '个肌群' : 'muscle groups'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 波浪分隔 */}
        <svg viewBox="0 0 1440 60" className="w-full h-12">
          <path d="M0 30 Q360 60, 720 30 T1440 30 V60 H0 Z" className="fill-white dark:fill-slate-900" />
        </svg>
      </div>

      {/* 主内容区 */}
      <div className="bg-white dark:bg-slate-900">
        <div className="container py-8">
          {/* 难度筛选 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedDifficulty === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty(null)}
              className={selectedDifficulty === null ? 'energy-button rounded-full' : 'rounded-full hover:bg-blue-50'}
            >
              <Activity className="w-4 h-4 mr-1" />
              {isZh ? '全部难度' : 'All Levels'}
            </Button>
            {difficultyOptions.map((diff) => (
              <Button
                key={diff.value}
                variant={selectedDifficulty === diff.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(diff.value)}
                className={selectedDifficulty === diff.value ? 'energy-button rounded-full' : 'rounded-full hover:bg-blue-50'}
              >
                {isZh ? diff.label : diff.labelEn}
              </Button>
            ))}
          </div>

          {/* 肌群分组 */}
          <div className="space-y-4">
            {groupedExercises.map((group) => (
              <div key={group.value} className="exercise-card rounded-2xl overflow-hidden">
                {/* 肌群标题 */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors"
                  onClick={() => toggleGroup(group.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${muscleColors[group.value] || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-md`}>
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {isZh ? group.label : group.labelEn}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {group.exercises.length} {isZh ? '个动作' : 'exercises'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full ${expandedGroups.has(group.value) ? 'bg-blue-500' : 'bg-slate-200'} flex items-center justify-center transition-colors`}>
                    {expandedGroups.has(group.value) ? (
                      <ChevronUp className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>

                {/* 动作列表 */}
                {expandedGroups.has(group.value) && group.exercises.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-slate-800 dark:to-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.exercises.map((exercise) => {
                      const diffBadge = getDifficultyBadge(exercise.difficulty);
                      return (
                        <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                          <div className="sport-card sport-card-click p-4 cursor-pointer group">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                                  {isZh ? exercise.name : exercise.nameEn}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`bg-gradient-to-r ${diffBadge.color} text-white rounded-full px-2 py-0.5 text-xs`}>
                                    {diffBadge.label}
                                  </Badge>
                                  <Badge variant="outline" className="rounded-full text-xs border-blue-500/20 text-blue-600">
                                    {getEquipmentLabel(exercise.equipment)}
                                  </Badge>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* 无动作提示 */}
                {expandedGroups.has(group.value) && group.exercises.length === 0 && (
                  <div className="p-4 bg-slate-50/50 text-center text-slate-500">
                    {isZh ? '暂无该肌群的动作' : 'No exercises for this muscle group'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 提示卡片 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
        <div className="container py-8">
          <div className="sport-card p-6 flex items-center gap-6 flex-wrap justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {isZh ? '💡 个动作都有详细教学' : '💡 Detailed Instructions for Each'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isZh
                  ? '点击动作查看详细说明、注意事项和变式训练'
                  : 'Click exercise to view detailed instructions, tips and variations'}
              </p>
            </div>
            <Link href="/knowledge">
              <Button className="energy-button rounded-full px-6">
                <Zap className="w-4 h-4 mr-2" />
                {isZh ? '学习原理' : 'Learn Principles'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}