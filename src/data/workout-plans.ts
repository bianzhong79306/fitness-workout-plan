import type { WorkoutPlan, FitnessGoal, PlanExercise } from '@/types/plan';
import { exercises } from './exercises';

// 辅助函数：根据动作ID获取动作配置
function createPlanExercise(exerciseId: string, sets: number, reps?: number, restSeconds: number = 60): PlanExercise {
  return {
    exerciseId,
    sets,
    reps,
    restSeconds,
  };
}

// ==================== 训练计划数据 ====================

export const workoutPlans: WorkoutPlan[] = [
  // 1. 初学者全身训练计划
  {
    id: 'beginner-full-body',
    name: '初学者全身训练',
    nameEn: 'Beginner Full Body Workout',
    description: '适合健身新手的基础全身训练计划，每周3次，持续4周。动作简单易学，无需器械。',
    descriptionEn: 'A beginner-friendly full body workout plan. 3 sessions per week for 4 weeks. Simple movements, no equipment needed.',
    goal: 'general',
    difficulty: 'beginner',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    equipment: ['none'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-1',
        planId: 'beginner-full-body',
        sessionNumber: 1,
        name: '全身训练 A',
        nameEn: 'Full Body A',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('wall-push-up', 3, 10, 45),
          createPlanExercise('squat', 3, 12, 60),
          createPlanExercise('knee-plank', 3, undefined, 30), // 30秒保持
          createPlanExercise('glute-bridge', 3, 12, 45),
          createPlanExercise('jumping-jack', 3, 20, 30),
        ],
      },
      {
        id: 'session-2',
        planId: 'beginner-full-body',
        sessionNumber: 2,
        name: '全身训练 B',
        nameEn: 'Full Body B',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('knee-push-up', 3, 10, 45),
          createPlanExercise('lunge', 3, 10, 60),
          createPlanExercise('crunch', 3, 15, 45),
          createPlanExercise('bird-dog', 3, 10, 45),
          createPlanExercise('high-knees', 3, 30, 30), // 30秒
        ],
      },
      {
        id: 'session-3',
        planId: 'beginner-full-body',
        sessionNumber: 3,
        name: '全身训练 C',
        nameEn: 'Full Body C',
        durationMinutes: 35,
        exercises: [
          createPlanExercise('push-up', 3, 8, 60),
          createPlanExercise('sumo-squat', 3, 12, 60),
          createPlanExercise('plank', 3, undefined, 30),
          createPlanExercise('side-lying-leg-raise', 3, 12, 45),
          createPlanExercise('mountain-climber', 3, 20, 45),
        ],
      },
    ],
  },

  // 2. 增肌训练计划
  {
    id: 'muscle-gain-basic',
    name: '基础增肌计划',
    nameEn: 'Basic Muscle Gain Plan',
    description: '专注于肌肉增长的训练计划，每周4次，持续6周。包含胸部、背部、腿部和手臂专项训练。',
    descriptionEn: 'A muscle-building focused plan. 4 sessions per week for 6 weeks. Includes chest, back, legs, and arms specific training.',
    goal: 'muscle_gain',
    difficulty: 'intermediate',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    equipment: ['chair', 'doorframe'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-mg-1',
        planId: 'muscle-gain-basic',
        sessionNumber: 1,
        name: '胸部与手臂',
        nameEn: 'Chest & Arms',
        durationMinutes: 45,
        exercises: [
          createPlanExercise('push-up', 4, 12, 90),
          createPlanExercise('diamond-push-up', 3, 10, 60),
          createPlanExercise('wide-push-up', 3, 12, 60),
          createPlanExercise('tricep-dip', 3, 12, 60),
          createPlanExercise('floor-tricep-dip', 3, 15, 45),
        ],
      },
      {
        id: 'session-mg-2',
        planId: 'muscle-gain-basic',
        sessionNumber: 2,
        name: '背部与肩部',
        nameEn: 'Back & Shoulders',
        durationMinutes: 45,
        exercises: [
          createPlanExercise('doorframe-row', 4, 12, 90),
          createPlanExercise('superman', 3, 12, 60),
          createPlanExercise('pike-push-up', 3, 10, 60),
          createPlanExercise('shoulder-taps', 3, 20, 45),
          createPlanExercise('swimmer', 3, 15, 45),
        ],
      },
      {
        id: 'session-mg-3',
        planId: 'muscle-gain-basic',
        sessionNumber: 3,
        name: '腿部训练',
        nameEn: 'Legs Training',
        durationMinutes: 50,
        exercises: [
          createPlanExercise('squat', 4, 15, 90),
          createPlanExercise('lunge', 3, 12, 60),
          createPlanExercise('bulgarian-split-squat', 3, 10, 60),
          createPlanExercise('glute-bridge', 4, 15, 60),
          createPlanExercise('calf-raise', 4, 20, 45),
        ],
      },
      {
        id: 'session-mg-4',
        planId: 'muscle-gain-basic',
        sessionNumber: 4,
        name: '核心与全身',
        nameEn: 'Core & Full Body',
        durationMinutes: 40,
        exercises: [
          createPlanExercise('plank', 4, undefined, 45),
          createPlanExercise('bicycle-crunch', 3, 20, 45),
          createPlanExercise('leg-raise', 3, 12, 60),
          createPlanExercise('mountain-climber', 3, 30, 30),
          createPlanExercise('burpee', 3, 8, 90),
        ],
      },
    ],
  },

  // 3. 减脂燃脂计划
  {
    id: 'fat-loss-hiit',
    name: 'HIIT减脂计划',
    nameEn: 'HIIT Fat Loss Plan',
    description: '高强度间歇训练计划，每周4次，持续4周。高效燃脂，提升心肺功能。',
    descriptionEn: 'High-intensity interval training plan. 4 sessions per week for 4 weeks. Effective fat burning and cardio improvement.',
    goal: 'fat_loss',
    difficulty: 'intermediate',
    durationWeeks: 4,
    sessionsPerWeek: 4,
    equipment: ['none'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-fl-1',
        planId: 'fat-loss-hiit',
        sessionNumber: 1,
        name: 'HIIT燃脂 A',
        nameEn: 'HIIT Burn A',
        durationMinutes: 25,
        exercises: [
          createPlanExercise('burpee', 4, 10, 60),
          createPlanExercise('jump-squat', 4, 15, 45),
          createPlanExercise('mountain-climber', 4, 30, 30),
          createPlanExercise('high-knees', 4, 40, 30),
        ],
      },
      {
        id: 'session-fl-2',
        planId: 'fat-loss-hiit',
        sessionNumber: 2,
        name: 'HIIT燃脂 B',
        nameEn: 'HIIT Burn B',
        durationMinutes: 25,
        exercises: [
          createPlanExercise('half-burpee', 4, 15, 45),
          createPlanExercise('jumping-jack', 4, 30, 30),
          createPlanExercise('skater-hop', 4, 20, 45),
          createPlanExercise('butt-kicks', 4, 40, 30),
        ],
      },
      {
        id: 'session-fl-3',
        planId: 'fat-loss-hiit',
        sessionNumber: 3,
        name: '核心燃脂',
        nameEn: 'Core Burn',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('plank', 3, undefined, 45),
          createPlanExercise('mountain-climber', 4, 40, 30),
          createPlanExercise('bicycle-crunch', 4, 25, 30),
          createPlanExercise('russian-twist', 4, 20, 30),
          createPlanExercise('v-up', 3, 12, 45),
        ],
      },
      {
        id: 'session-fl-4',
        planId: 'fat-loss-hiit',
        sessionNumber: 4,
        name: '全身燃脂',
        nameEn: 'Full Body Burn',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('jumping-jack', 3, 40, 30),
          createPlanExercise('push-up', 3, 15, 45),
          createPlanExercise('jump-squat', 3, 20, 45),
          createPlanExercise('mountain-climber', 3, 40, 30),
          createPlanExercise('burpee', 3, 10, 60),
        ],
      },
    ],
  },

  // 4. 居家办公室健身计划
  {
    id: 'office-home-workout',
    name: '办公室居家健身',
    nameEn: 'Office & Home Workout',
    description: '适合上班族和家庭训练的计划，利用椅子、墙壁等日常物品。每周3次，持续4周。',
    descriptionEn: 'Perfect for office workers and home training. Uses chairs, walls, and everyday items. 3 sessions per week for 4 weeks.',
    goal: 'general',
    difficulty: 'beginner',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    equipment: ['chair', 'wall', 'doorframe'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-oh-1',
        planId: 'office-home-workout',
        sessionNumber: 1,
        name: '上肢训练',
        nameEn: 'Upper Body',
        durationMinutes: 25,
        exercises: [
          createPlanExercise('incline-push-up', 3, 12, 60),
          createPlanExercise('tricep-dip', 3, 12, 60),
          createPlanExercise('doorframe-row', 3, 12, 60),
          createPlanExercise('shoulder-taps', 3, 15, 45),
          createPlanExercise('wall-push-up', 3, 15, 45),
        ],
      },
      {
        id: 'session-oh-2',
        planId: 'office-home-workout',
        sessionNumber: 2,
        name: '下肢训练',
        nameEn: 'Lower Body',
        durationMinutes: 25,
        exercises: [
          createPlanExercise('wall-sit', 3, undefined, 45),
          createPlanExercise('squat', 3, 15, 60),
          createPlanExercise('lunge', 3, 12, 60),
          createPlanExercise('calf-raise', 3, 20, 45),
          createPlanExercise('hip-thrust', 3, 12, 60),
        ],
      },
      {
        id: 'session-oh-3',
        planId: 'office-home-workout',
        sessionNumber: 3,
        name: '核心训练',
        nameEn: 'Core Training',
        durationMinutes: 20,
        exercises: [
          createPlanExercise('plank', 3, undefined, 30),
          createPlanExercise('dead-bug', 3, 12, 45),
          createPlanExercise('crunch', 3, 15, 45),
          createPlanExercise('bird-dog', 3, 10, 45),
        ],
      },
    ],
  },

  // 5. 核心强化计划
  {
    id: 'core-strength-plan',
    name: '核心强化计划',
    nameEn: 'Core Strength Plan',
    description: '专注核心肌群训练，提升腹部、腰部和背部力量。每周3次，持续4周。',
    descriptionEn: 'Focus on core muscle training. Strengthen abs, waist, and back. 3 sessions per week for 4 weeks.',
    goal: 'strength',
    difficulty: 'intermediate',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    equipment: ['none'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-cs-1',
        planId: 'core-strength-plan',
        sessionNumber: 1,
        name: '腹肌训练',
        nameEn: 'Abs Training',
        durationMinutes: 25,
        exercises: [
          createPlanExercise('crunch', 4, 20, 45),
          createPlanExercise('bicycle-crunch', 4, 20, 45),
          createPlanExercise('leg-raise', 4, 12, 60),
          createPlanExercise('reverse-crunch', 3, 15, 45),
          createPlanExercise('v-up', 3, 10, 60),
        ],
      },
      {
        id: 'session-cs-2',
        planId: 'core-strength-plan',
        sessionNumber: 2,
        name: '核心稳定',
        nameEn: 'Core Stability',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('plank', 4, undefined, 45),
          createPlanExercise('side-plank', 3, undefined, 30),
          createPlanExercise('dead-bug', 4, 12, 45),
          createPlanExercise('bird-dog', 4, 10, 45),
          createPlanExercise('mountain-climber', 3, 30, 30),
        ],
      },
      {
        id: 'session-cs-3',
        planId: 'core-strength-plan',
        sessionNumber: 3,
        name: '综合核心',
        nameEn: 'Full Core',
        durationMinutes: 25,
        exercises: [
          createPlanExercise('plank', 3, undefined, 45),
          createPlanExercise('russian-twist', 4, 20, 45),
          createPlanExercise('bicycle-crunch', 4, 25, 45),
          createPlanExercise('superman', 3, 12, 45),
          createPlanExercise('leg-raise', 3, 12, 60),
        ],
      },
    ],
  },

  // 6. 腿臀塑形计划
  {
    id: 'legs-glutes-shape',
    name: '腿臀塑形计划',
    nameEn: 'Legs & Glutes Shaping',
    description: '专注于腿部和臀部塑形的训练计划，打造紧致曲线。每周4次，持续6周。',
    descriptionEn: 'Focus on legs and glutes shaping. Create toned curves. 4 sessions per week for 6 weeks.',
    goal: 'general',
    difficulty: 'intermediate',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    equipment: ['chair', 'none'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-lg-1',
        planId: 'legs-glutes-shape',
        sessionNumber: 1,
        name: '臀部训练',
        nameEn: 'Glutes Training',
        durationMinutes: 35,
        exercises: [
          createPlanExercise('glute-bridge', 4, 15, 60),
          createPlanExercise('single-leg-glute-bridge', 3, 10, 60),
          createPlanExercise('hip-thrust', 4, 12, 60),
          createPlanExercise('donkey-kick', 3, 15, 45),
          createPlanExercise('fire-hydrant', 3, 12, 45),
        ],
      },
      {
        id: 'session-lg-2',
        planId: 'legs-glutes-shape',
        sessionNumber: 2,
        name: '腿部力量',
        nameEn: 'Legs Strength',
        durationMinutes: 40,
        exercises: [
          createPlanExercise('squat', 4, 15, 90),
          createPlanExercise('lunge', 4, 12, 60),
          createPlanExercise('bulgarian-split-squat', 3, 10, 60),
          createPlanExercise('sumo-squat', 4, 12, 60),
          createPlanExercise('calf-raise', 4, 20, 45),
        ],
      },
      {
        id: 'session-lg-3',
        planId: 'legs-glutes-shape',
        sessionNumber: 3,
        name: '臀腿综合',
        nameEn: 'Glutes & Legs Combo',
        durationMinutes: 40,
        exercises: [
          createPlanExercise('squat', 3, 15, 60),
          createPlanExercise('side-lunge', 3, 12, 60),
          createPlanExercise('glute-bridge', 3, 15, 60),
          createPlanExercise('curtsy-lunge', 3, 10, 60),
          createPlanExercise('single-leg-calf-raise', 3, 15, 45),
        ],
      },
      {
        id: 'session-lg-4',
        planId: 'legs-glutes-shape',
        sessionNumber: 4,
        name: '爆发力训练',
        nameEn: 'Power Training',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('jump-squat', 4, 15, 60),
          createPlanExercise('skater-hop', 4, 20, 45),
          createPlanExercise('walking-lunge', 3, 20, 45),
          createPlanExercise('high-knees', 3, 40, 30),
        ],
      },
    ],
  },

  // 7. 晨间唤醒计划
  {
    id: 'morning-energizer',
    name: '晨间唤醒计划',
    nameEn: 'Morning Energizer',
    description: '每天15分钟的晨间训练，唤醒身体，提升活力。适合每日进行。',
    descriptionEn: '15-minute morning workout to energize your body. Perfect for daily practice.',
    goal: 'general',
    difficulty: 'beginner',
    durationWeeks: 8,
    sessionsPerWeek: 7,
    equipment: ['none'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-me',
        planId: 'morning-energizer',
        sessionNumber: 1,
        name: '晨间唤醒',
        nameEn: 'Morning Energizer',
        durationMinutes: 15,
        exercises: [
          createPlanExercise('jumping-jack', 2, 30, 30),
          createPlanExercise('cat-cow', 2, 10, 30),
          createPlanExercise('squat', 2, 12, 45),
          createPlanExercise('push-up', 2, 8, 45),
          createPlanExercise('plank', 2, undefined, 20),
          createPlanExercise('downward-dog', 2, undefined, 30),
        ],
      },
    ],
  },

  // 8. 力量提升计划
  {
    id: 'strength-builder',
    name: '力量提升计划',
    nameEn: 'Strength Builder',
    description: '专注于提升整体力量的训练计划，适合有一定基础的训练者。每周4次，持续8周。',
    descriptionEn: 'Focus on overall strength improvement. For intermediate trainers. 4 sessions per week for 8 weeks.',
    goal: 'strength',
    difficulty: 'intermediate',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    equipment: ['chair', 'doorframe', 'wall'],
    isPremium: true,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-sb-1',
        planId: 'strength-builder',
        sessionNumber: 1,
        name: '推力训练',
        nameEn: 'Push Strength',
        durationMinutes: 45,
        exercises: [
          createPlanExercise('push-up', 5, 15, 90),
          createPlanExercise('decline-push-up', 4, 12, 60),
          createPlanExercise('pike-push-up', 4, 10, 60),
          createPlanExercise('diamond-push-up', 4, 12, 60),
          createPlanExercise('tricep-dip', 4, 15, 60),
        ],
      },
      {
        id: 'session-sb-2',
        planId: 'strength-builder',
        sessionNumber: 2,
        name: '拉力训练',
        nameEn: 'Pull Strength',
        durationMinutes: 40,
        exercises: [
          createPlanExercise('doorframe-row', 5, 15, 90),
          createPlanExercise('table-row', 4, 12, 60),
          createPlanExercise('superman', 4, 15, 45),
          createPlanExercise('swimmer', 4, 20, 45),
        ],
      },
      {
        id: 'session-sb-3',
        planId: 'strength-builder',
        sessionNumber: 3,
        name: '腿部力量',
        nameEn: 'Leg Strength',
        durationMinutes: 50,
        exercises: [
          createPlanExercise('squat', 5, 20, 90),
          createPlanExercise('bulgarian-split-squat', 4, 12, 60),
          createPlanExercise('lunge', 4, 15, 60),
          createPlanExercise('wall-sit', 4, undefined, 45),
          createPlanExercise('single-leg-calf-raise', 4, 15, 45),
        ],
      },
      {
        id: 'session-sb-4',
        planId: 'strength-builder',
        sessionNumber: 4,
        name: '核心力量',
        nameEn: 'Core Strength',
        durationMinutes: 35,
        exercises: [
          createPlanExercise('plank', 5, undefined, 60),
          createPlanExercise('leg-raise', 4, 15, 60),
          createPlanExercise('v-up', 4, 12, 60),
          createPlanExercise('russian-twist', 4, 25, 45),
        ],
      },
    ],
  },

  // 9. 拉伸放松计划
  {
    id: 'stretching-relax',
    name: '拉伸放松计划',
    nameEn: 'Stretching & Relaxation',
    description: '每日拉伸放松计划，改善柔韧性，缓解肌肉紧张。适合训练后或睡前进行。',
    descriptionEn: 'Daily stretching plan to improve flexibility and relieve muscle tension. Perfect for post-workout or before bed.',
    goal: 'general',
    difficulty: 'beginner',
    durationWeeks: 8,
    sessionsPerWeek: 7,
    equipment: ['none', 'doorframe'],
    isPremium: false,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-sr',
        planId: 'stretching-relax',
        sessionNumber: 1,
        name: '全身拉伸',
        nameEn: 'Full Body Stretch',
        durationMinutes: 20,
        exercises: [
          createPlanExercise('downward-dog', 2, undefined, 30),
          createPlanExercise('childs-pose', 2, undefined, 45),
          createPlanExercise('hip-flexor-stretch', 2, undefined, 30),
          createPlanExercise('hamstring-stretch', 2, undefined, 30),
          createPlanExercise('quad-stretch', 2, undefined, 30),
          createPlanExercise('chest-stretch', 2, undefined, 30),
          createPlanExercise('seated-spinal-twist', 2, undefined, 30),
        ],
      },
    ],
  },

  // 10. 高级全身挑战计划
  {
    id: 'advanced-full-body-challenge',
    name: '高级全身挑战',
    nameEn: 'Advanced Full Body Challenge',
    description: '高强度的全身训练挑战计划，适合有扎实基础的训练者。每周5次，持续4周。',
    descriptionEn: 'High-intensity full body challenge. For experienced trainers. 5 sessions per week for 4 weeks.',
    goal: 'strength',
    difficulty: 'advanced',
    durationWeeks: 4,
    sessionsPerWeek: 5,
    equipment: ['chair', 'wall'],
    isPremium: true,
    isPublished: true,
    createdAt: '2025-01-01',
    sessions: [
      {
        id: 'session-ad-1',
        planId: 'advanced-full-body-challenge',
        sessionNumber: 1,
        name: '高强度训练',
        nameEn: 'High Intensity',
        durationMinutes: 40,
        exercises: [
          createPlanExercise('burpee', 5, 12, 60),
          createPlanExercise('clap-push-up', 4, 10, 60),
          createPlanExercise('jump-squat', 5, 20, 45),
          createPlanExercise('mountain-climber', 5, 50, 30),
        ],
      },
      {
        id: 'session-ad-2',
        planId: 'advanced-full-body-challenge',
        sessionNumber: 2,
        name: '力量极限',
        nameEn: 'Strength Max',
        durationMinutes: 45,
        exercises: [
          createPlanExercise('push-up', 6, 20, 90),
          createPlanExercise('squat', 6, 25, 90),
          createPlanExercise('pike-push-up', 5, 12, 60),
          createPlanExercise('bulgarian-split-squat', 5, 15, 60),
        ],
      },
      {
        id: 'session-ad-3',
        planId: 'advanced-full-body-challenge',
        sessionNumber: 3,
        name: '核心极限',
        nameEn: 'Core Max',
        durationMinutes: 30,
        exercises: [
          createPlanExercise('plank', 5, undefined, 60),
          createPlanExercise('v-up', 5, 15, 60),
          createPlanExercise('leg-raise', 5, 15, 60),
          createPlanExercise('russian-twist', 5, 30, 45),
        ],
      },
      {
        id: 'session-ad-4',
        planId: 'advanced-full-body-challenge',
        sessionNumber: 4,
        name: '爆发力训练',
        nameEn: 'Power Training',
        durationMinutes: 35,
        exercises: [
          createPlanExercise('clap-push-up', 4, 12, 60),
          createPlanExercise('jump-squat', 5, 20, 45),
          createPlanExercise('skater-hop', 5, 25, 45),
          createPlanExercise('burpee', 5, 15, 60),
        ],
      },
      {
        id: 'session-ad-5',
        planId: 'advanced-full-body-challenge',
        sessionNumber: 5,
        name: '耐力挑战',
        nameEn: 'Endurance Challenge',
        durationMinutes: 50,
        exercises: [
          createPlanExercise('mountain-climber', 6, 60, 30),
          createPlanExercise('burpee', 6, 15, 60),
          createPlanExercise('high-knees', 6, 60, 30),
          createPlanExercise('jumping-jack', 6, 50, 30),
        ],
      },
    ],
  },
];

// 辅助函数：根据目标筛选计划
export function filterPlansByGoal(goal: FitnessGoal): WorkoutPlan[] {
  return workoutPlans.filter(plan => plan.goal === goal);
}

// 辅助函数：根据难度筛选计划
export function filterPlansByDifficulty(difficulty: string): WorkoutPlan[] {
  return workoutPlans.filter(plan => plan.difficulty === difficulty);
}

// 辅助函数：获取免费计划
export function getFreePlans(): WorkoutPlan[] {
  return workoutPlans.filter(plan => !plan.isPremium);
}

// 辅助函数：根据ID获取计划
export function getPlanById(id: string): WorkoutPlan | undefined {
  return workoutPlans.find(plan => plan.id === id);
}

// 辅助函数：获取计划中某个session的所有动作详情
export function getSessionExercises(planId: string, sessionNumber: number) {
  const plan = getPlanById(planId);
  if (!plan) return [];

  const session = plan.sessions.find(s => s.sessionNumber === sessionNumber);
  if (!session) return [];

  return session.exercises.map(pe => {
    const exercise = exercises.find(e => e.id === pe.exerciseId);
    return {
      ...pe,
      exercise,
    };
  });
}

// 计划总数
export const totalPlans = workoutPlans.length;