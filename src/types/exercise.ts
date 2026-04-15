// 动作类型定义

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'legs'
  | 'glutes'
  | 'full-body'
  | 'neck';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseType = 'strength' | 'cardio' | 'stretch' | 'balance' | 'plyometric';

export type Equipment = 'none' | 'chair' | 'doorframe' | 'wall' | 'towel' | 'table' | 'dumbbell' | 'barbell' | 'gym' | 'bar' | 'dip-bar' | 'ab-wheel';

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  muscles: MuscleGroup[];
  difficulty: Difficulty;
  type: ExerciseType;
  equipment: Equipment;
  tips: string[];
  mistakes: string[];
  alternatives?: string[];
  image?: string;
  // gifUrl?: string; // TODO: 后期添加专业健身GIF演示（需解决版权问题）
  videoUrl?: string;
}

export interface MuscleGroupOption {
  value: MuscleGroup;
  label: string;
  labelEn: string;
}

export const muscleGroupOptions: MuscleGroupOption[] = [
  { value: 'chest', label: '胸部', labelEn: 'Chest' },
  { value: 'back', label: '背部', labelEn: 'Back' },
  { value: 'shoulders', label: '肩部', labelEn: 'Shoulders' },
  { value: 'arms', label: '手臂', labelEn: 'Arms' },
  { value: 'core', label: '核心', labelEn: 'Core' },
  { value: 'legs', label: '腿部', labelEn: 'Legs' },
  { value: 'glutes', label: '臀部', labelEn: 'Glutes' },
  { value: 'full-body', label: '全身', labelEn: 'Full Body' },
];

export const difficultyOptions = [
  { value: 'beginner', label: '初级', labelEn: 'Beginner' },
  { value: 'intermediate', label: '中级', labelEn: 'Intermediate' },
  { value: 'advanced', label: '高级', labelEn: 'Advanced' },
];

export const equipmentOptions = [
  { value: 'none', label: '徒手', labelEn: 'No Equipment' },
  { value: 'chair', label: '椅子', labelEn: 'Chair' },
  { value: 'wall', label: '墙壁', labelEn: 'Wall' },
  { value: 'dumbbell', label: '哑铃', labelEn: 'Dumbbell' },
  { value: 'barbell', label: '杠铃', labelEn: 'Barbell' },
  { value: 'gym', label: '健身房', labelEn: 'Gym' },
];