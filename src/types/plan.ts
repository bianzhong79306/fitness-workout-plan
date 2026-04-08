// 训练计划类型定义

import type { Difficulty, Equipment } from './exercise';

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance' | 'general';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// 训练计划中的动作配置
export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps?: number;           // 每组次数
  duration?: number;       // 动作持续时间(秒)，用于计时类动作
  restSeconds: number;     // 组间休息时间(秒)
  weight?: number;         // 重量(kg)，可选
}

// 单次训练课程
export interface WorkoutSession {
  id: string;
  planId: string;
  sessionNumber: number;   // 计划中的第几天
  name: string;
  nameEn: string;
  durationMinutes: number;
  exercises: PlanExercise[];
  dayOfWeek?: WeekDay;
}

// 训练计划
export interface WorkoutPlan {
  id: string;
  creatorId?: string;      // 用户创建的计划有creatorId
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  goal: FitnessGoal;
  difficulty: Difficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  equipment: Equipment[];
  isPremium: boolean;
  isPublished: boolean;
  imageUrl?: string;
  sessions: WorkoutSession[];
  createdAt: string;
}

// 训练计划目标选项
export const fitnessGoalOptions = [
  { value: 'muscle_gain', label: '增肌', labelEn: 'Muscle Gain' },
  { value: 'fat_loss', label: '减脂', labelEn: 'Fat Loss' },
  { value: 'strength', label: '力量提升', labelEn: 'Strength' },
  { value: 'endurance', label: '耐力提升', labelEn: 'Endurance' },
  { value: 'general', label: '综合健身', labelEn: 'General Fitness' },
];