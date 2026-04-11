"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exercises } from "@/data/exercises";
import { muscleGroupOptions, difficultyOptions } from "@/types/exercise";
import { Dumbbell, Clock, ChevronDown, ChevronUp, Filter } from "lucide-react";

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
    
    const variant: "secondary" | "default" | "destructive" = difficulty === "beginner" ? "secondary" 
      : difficulty === "intermediate" ? "default" 
      : "destructive";
    
    return { label, variant };
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

  // 计算总数
  const totalFiltered = selectedDifficulty 
    ? exercises.filter(e => e.difficulty === selectedDifficulty).length 
    : exercises.length;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {isZh ? "动作库" : "Exercise Library"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isZh
            ? `共 ${totalFiltered} 个训练动作`
            : `${totalFiltered} exercises available`}
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedDifficulty === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty(null)}
        >
          {isZh ? "全部难度" : "All Levels"}
        </Button>
        {difficultyOptions.map((level) => (
          <Button
            key={level.value}
            variant={selectedDifficulty === level.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(level.value)}
          >
            {isZh ? level.label : level.labelEn}
          </Button>
        ))}
      </div>

      {/* Exercise Groups */}
      <div className="space-y-8">
        {groupedExercises.map((group) => (
          group.exercises.length > 0 && (
            <section key={group.value}>
              <div 
                className="flex items-center gap-2 mb-4 cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleGroup(group.value)}
              >
                <Dumbbell className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">
                  {isZh ? group.label : group.labelEn}
                </h2>
                <Badge variant="secondary">{group.exercises.length}</Badge>
                {expandedGroups.has(group.value) ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {(expandedGroups.has(group.value) 
                  ? group.exercises 
                  : group.exercises.slice(0, 6)
                ).map((exercise) => (
                  <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                    <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm group-hover:text-primary transition-colors">
                            {isZh ? exercise.name : exercise.nameEn}
                          </CardTitle>
                          <Badge variant={getDifficultyBadge(exercise.difficulty).variant} className="text-xs">
                            {getDifficultyBadge(exercise.difficulty).label}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 text-xs">
                          {exercise.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {exercise.type === "cardio" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {getEquipmentLabel(exercise.equipment)}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {group.exercises.length > 6 && !expandedGroups.has(group.value) && (
                <div className="mt-3 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleGroup(group.value)}
                    className="gap-1"
                  >
                    {isZh
                      ? `展开全部 ${group.exercises.length} 个动作`
                      : `Show all ${group.exercises.length} exercises`}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </section>
          )
        ))}
      </div>

      {/* Quick Tip */}
      <div className="mt-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {isZh ? "💡 动作学习建议" : "💡 Learning Tips"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isZh
                    ? "点击动作查看详细教学，包括动作要点、常见错误和替代方案。建议先掌握基础动作再尝试高级动作。"
                    : "Click any exercise to see detailed instructions including tips, common mistakes, and alternatives. Start with beginner exercises before advancing."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}