// 训练记录类型定义

// 单组训练数据
export interface ExerciseSet {
  setNumber: number;
  reps: number;            // 实际完成的次数
  weight?: number;         // 实际使用的重量(kg)
  duration?: number;       // 动作持续时间(秒)
  completed: boolean;      // 是否完成
}

// 训练中单个动作的记录
export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  exerciseNameEn: string;
  plannedSets: number;
  plannedReps?: number;
  sets: ExerciseSet[];
  completedSets: number;
}

// 训练记录
export interface WorkoutLog {
  id: string;
  userId: string;
  sessionId?: string;
  planId?: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  exercises: WorkoutExerciseLog[];
  totalSets: number;
  totalReps: number;
  notes?: string;
  rating?: number;         // 1-5评分
  caloriesBurned?: number;
}

// 训练状态（用于训练执行过程中）
export type WorkoutStatus = 'idle' | 'active' | 'resting' | 'paused' | 'completed';

// 训练执行状态
export interface WorkoutState {
  planId?: string;
  sessionId?: string;
  currentExerciseIndex: number;
  currentSetIndex: number;
  exercises: WorkoutExerciseLog[];
  status: WorkoutStatus;
  startTime: Date | null;
  restTimeRemaining: number;
  totalDuration: number;
}

// 用户身体数据
export interface BodyMetrics {
  id: string;
  userId: string;
  weight?: number;         // kg
  height?: number;         // cm
  bodyFat?: number;        // 百分比
  chest?: number;          // cm
  waist?: number;          // cm
  hip?: number;            // cm
  arm?: number;            // cm
  thigh?: number;          // cm
  recordedAt: string;
}

// 用户进度统计
export interface ProgressStats {
  totalWorkouts: number;
  totalDuration: number;   // 总训练时间(分钟)
  totalSets: number;
  totalReps: number;
  currentStreak: number;   // 连续训练天数
  longestStreak: number;
  weeklyFrequency: number; // 每周训练频率
  lastWorkoutDate?: string;
}

// 用户计划订阅
export interface UserPlanSubscription {
  id: string;
  userId: string;
  planId: string;
  startedAt: string;
  currentWeek: number;
  completedSessions: number;
  isActive: boolean;
}

// 成就类型
export type AchievementType =
  | 'first_workout'
  | 'streak_7'
  | 'streak_30'
  | 'total_workouts_10'
  | 'total_workouts_50'
  | 'total_workouts_100';

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: AchievementType;
  unlockedAt: string;
}

// 成就定义
export const achievements = [
  { id: 'first_workout', label: '初次训练', labelEn: 'First Workout', icon: 'trophy' },
  { id: 'streak_7', label: '连续7天', labelEn: '7-Day Streak', icon: 'fire' },
  { id: 'streak_30', label: '连续30天', labelEn: '30-Day Streak', icon: 'flame' },
  { id: 'total_workouts_10', label: '10次训练', labelEn: '10 Workouts', icon: 'badge' },
  { id: 'total_workouts_50', label: '50次训练', labelEn: '50 Workouts', icon: 'medal' },
  { id: 'total_workouts_100', label: '100次训练', labelEn: '100 Workouts', icon: 'star' },
];