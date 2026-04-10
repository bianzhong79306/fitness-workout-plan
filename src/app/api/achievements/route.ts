// Achievements API - 成就系统

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// 预定义成就
const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'first-workout',
    name: '首次训练',
    name_en: 'First Workout',
    description: '完成你的第一次训练',
    description_en: 'Complete your first workout',
    icon: 'trophy',
    category: 'milestone',
    requirement_type: 'total_workouts',
    requirement_value: 1,
    points: 10,
  },
  {
    id: 'week-warrior',
    name: '周战士',
    name_en: 'Week Warrior',
    description: '连续训练7天',
    description_en: 'Work out 7 days in a row',
    icon: 'flame',
    category: 'streak',
    requirement_type: 'streak_days',
    requirement_value: 7,
    points: 50,
  },
  {
    id: 'iron-will',
    name: '钢铁意志',
    name_en: 'Iron Will',
    description: '连续训练30天',
    description_en: 'Work out 30 days in a row',
    icon: 'medal',
    category: 'streak',
    requirement_type: 'streak_days',
    requirement_value: 30,
    points: 200,
  },
  {
    id: 'ten-workouts',
    name: '健身新手',
    name_en: 'Fitness Beginner',
    description: '完成10次训练',
    description_en: 'Complete 10 workouts',
    icon: 'star',
    category: 'milestone',
    requirement_type: 'total_workouts',
    requirement_value: 10,
    points: 30,
  },
  {
    id: 'fifty-workouts',
    name: '健身达人',
    name_en: 'Fitness Enthusiast',
    description: '完成50次训练',
    description_en: 'Complete 50 workouts',
    icon: 'award',
    category: 'milestone',
    requirement_type: 'total_workouts',
    requirement_value: 50,
    points: 100,
  },
  {
    id: 'hundred-workouts',
    name: '健身大师',
    name_en: 'Fitness Master',
    description: '完成100次训练',
    description_en: 'Complete 100 workouts',
    icon: 'crown',
    category: 'milestone',
    requirement_type: 'total_workouts',
    requirement_value: 100,
    points: 300,
  },
  {
    id: 'early-bird',
    name: '早起鸟',
    name_en: 'Early Bird',
    description: '在早上6点前完成训练',
    description_en: 'Complete a workout before 6 AM',
    icon: 'sunrise',
    category: 'special',
    requirement_type: 'early_workout',
    requirement_value: 1,
    points: 25,
  },
  {
    id: 'night-owl',
    name: '夜猫子',
    name_en: 'Night Owl',
    description: '在晚上10点后完成训练',
    description_en: 'Complete a workout after 10 PM',
    icon: 'moon',
    category: 'special',
    requirement_type: 'late_workout',
    requirement_value: 1,
    points: 25,
  },
  {
    id: 'thousand-sets',
    name: '千组成就',
    name_en: 'Thousand Sets',
    description: '累计完成1000组动作',
    description_en: 'Complete 1000 total sets',
    icon: 'dumbbell',
    category: 'milestone',
    requirement_type: 'total_sets',
    requirement_value: 1000,
    points: 150,
  },
  {
    id: 'goal-crusher',
    name: '目标粉碎机',
    name_en: 'Goal Crusher',
    description: '连续4周完成周目标',
    description_en: 'Complete weekly goal 4 weeks in a row',
    icon: 'target',
    category: 'goal',
    requirement_type: 'weekly_goal_streak',
    requirement_value: 4,
    points: 75,
  },
];

// GET: 获取成就列表或用户已解锁成就
export async function GET(request: NextRequest) {
  const session = await auth();

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const userOnly = searchParams.get('user_only') === 'true';

    if (userOnly && session?.user?.email) {
      // 获取用户已解锁的成就
      const user = await db
        .prepare('SELECT id FROM users WHERE email = ?')
        .bind(session.user.email)
        .first<{ id: string }>();

      if (!user) {
        return NextResponse.json({ achievements: [] });
      }

      const result = await db
        .prepare(`
          SELECT
            ua.achievement_id as id,
            ua.unlocked_at,
            a.name, a.name_en, a.description, a.description_en,
            a.icon, a.category, a.points
          FROM user_achievements ua
          LEFT JOIN achievements a ON ua.achievement_id = a.id
          WHERE ua.user_id = ?
          ORDER BY ua.unlocked_at DESC
        `)
        .bind(user.id)
        .all<{
          id: string;
          unlocked_at: string;
          name: string;
          name_en: string;
          description: string;
          description_en: string;
          icon: string;
          category: string;
          points: number;
        }>();

      // 计算总积分
      const totalPoints = result.results.reduce((sum, a) => sum + (a.points || 0), 0);

      return NextResponse.json({
        achievements: result.results,
        totalPoints,
        totalUnlocked: result.results.length,
      });
    }

    // 获取所有成就定义
    const dbAchievements = await db
      .prepare('SELECT * FROM achievements WHERE is_active = 1')
      .all();

    // 如果数据库没有成就，使用默认成就
    const achievements = dbAchievements.results.length > 0
      ? dbAchievements.results
      : DEFAULT_ACHIEVEMENTS;

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('[Achievements API] Error:', error);
    return NextResponse.json({ achievements: DEFAULT_ACHIEVEMENTS });
  }
}