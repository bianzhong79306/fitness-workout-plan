// 会员系统数据库操作

import type { TierId, UserSubscription, MembershipTier, TierLimits } from '@/types/membership';
import type { D1Database } from '@/types/database';
import { DEFAULT_TIERS, getTierById } from '@/types/membership';

// =====================
// 用户订阅操作
// =====================

/**
 * 获取用户当前有效订阅
 */
export async function getUserActiveSubscription(
  db: D1Database,
  userId: string
): Promise<UserSubscription | null> {
  // 使用 strftime 统一时间格式进行比较
  const result = await db
    .prepare(`
      SELECT
        id,
        user_id as userId,
        tier_id as tierId,
        status,
        started_at as startedAt,
        expires_at as expiresAt,
        cancelled_at as cancelledAt,
        created_at as createdAt
      FROM user_subscriptions
      WHERE user_id = ? AND status = 'active'
      AND (expires_at IS NULL OR strftime('%Y-%m-%dT%H:%M:%SZ', expires_at) > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))
      ORDER BY created_at DESC
      LIMIT 1
    `)
    .bind(userId)
    .first<UserSubscription>();

  return result;
}

/**
 * 获取用户所有订阅历史
 */
export async function getUserSubscriptionHistory(
  db: D1Database,
  userId: string,
  limit: number = 10
): Promise<UserSubscription[]> {
  const result = await db
    .prepare(`
      SELECT
        id,
        user_id as userId,
        tier_id as tierId,
        status,
        started_at as startedAt,
        expires_at as expiresAt,
        cancelled_at as cancelledAt,
        created_at as createdAt
      FROM user_subscriptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .bind(userId, limit)
    .all<UserSubscription>();

  return result.results;
}

/**
 * 创建新订阅
 */
export async function createSubscription(
  db: D1Database,
  subscription: Omit<UserSubscription, 'id' | 'createdAt'>
): Promise<UserSubscription> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await db
    .prepare(`
      INSERT INTO user_subscriptions (id, user_id, tier_id, status, started_at, expires_at, cancelled_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      subscription.userId,
      subscription.tierId,
      subscription.status,
      subscription.startedAt,
      subscription.expiresAt ?? null,
      subscription.cancelledAt ?? null,
      now
    )
    .run();
  
  return {
    id,
    createdAt: now,
    ...subscription,
  };
}

/**
 * 取消订阅
 */
export async function cancelSubscription(
  db: D1Database,
  subscriptionId: string
): Promise<boolean> {
  const now = new Date().toISOString();
  
  const result = await db
    .prepare(`
      UPDATE user_subscriptions 
      SET status = 'cancelled', cancelled_at = ?
      WHERE id = ?
    `)
    .bind(now, subscriptionId)
    .run();
  
  return result.success;
}

/**
 * 更新订阅状态（过期处理等）
 */
export async function updateSubscriptionStatus(
  db: D1Database,
  subscriptionId: string,
  status: 'active' | 'cancelled' | 'expired'
): Promise<boolean> {
  const result = await db
    .prepare(`
      UPDATE user_subscriptions SET status = ? WHERE id = ?
    `)
    .bind(status, subscriptionId)
    .run();
  
  return result.success;
}

// =====================
// 用户会员等级操作
// =====================

/**
 * 获取用户当前会员等级
 */
export async function getUserTier(db: D1Database, userId: string): Promise<TierId> {
  // 先检查有效订阅
  const subscription = await getUserActiveSubscription(db, userId);
  if (subscription) {
    return subscription.tierId;
  }
  
  // 没有有效订阅则检查用户表的默认等级
  const user = await db
    .prepare('SELECT membership_tier FROM users WHERE id = ?')
    .bind(userId)
    .first<{ membership_tier: string }>();
  
  return (user?.membership_tier as TierId) || 'free';
}

/**
 * 获取用户会员限制配置
 */
export async function getUserLimits(db: D1Database, userId: string): Promise<TierLimits> {
  const tierId = await getUserTier(db, userId);
  const tier = getTierById(tierId);
  return tier?.limits ?? DEFAULT_TIERS[0].limits;
}

/**
 * 更新用户会员等级
 */
export async function updateUserTier(
  db: D1Database,
  userId: string,
  tierId: TierId
): Promise<boolean> {
  const result = await db
    .prepare('UPDATE users SET membership_tier = ? WHERE id = ?')
    .bind(tierId, userId)
    .run();
  
  return result.success;
}

// =====================
// 会员等级配置操作
// =====================

/**
 * 获取所有会员等级配置
 */
export async function getAllTiers(db: D1Database): Promise<MembershipTier[]> {
  const result = await db
    .prepare('SELECT * FROM membership_tiers WHERE is_active = 1 ORDER BY price_monthly ASC')
    .all<{
      id: string;
      name: string;
      name_zh: string;
      price_monthly: number;
      price_yearly: number;
      features_json: string;
      limits_json: string;
      is_active: number;
    }>();
  
  if (result.results.length === 0) {
    return DEFAULT_TIERS.filter(t => t.isActive);
  }
  
  return result.results.map(row => ({
    id: row.id as TierId,
    name: row.name,
    nameZh: row.name_zh,
    priceMonthly: row.price_monthly,
    priceYearly: row.price_yearly,
    features: JSON.parse(row.features_json),
    limits: JSON.parse(row.limits_json),
    isActive: row.is_active === 1,
  }));
}

// =====================
// 权限检查辅助函数
// =====================

/**
 * 检查用户是否可以生成AI计划
 */
export async function canGenerateAIPlan(
  db: D1Database,
  userId: string,
  todayGenerations: number
): Promise<{ allowed: boolean; reason?: string; remaining: number }> {
  const limits = await getUserLimits(db, userId);
  
  if (limits.aiGenerationsPerDay === -1) {
    return { allowed: true, remaining: -1 };
  }
  
  const remaining = limits.aiGenerationsPerDay - todayGenerations;
  
  if (remaining <= 0) {
    return { 
      allowed: false, 
      reason: '今日AI生成次数已用完，请升级会员获取更多次数',
      remaining: 0 
    };
  }
  
  return { allowed: true, remaining };
}

/**
 * 检查用户是否可以访问高级计划
 */
export async function canAccessPremiumPlans(db: D1Database, userId: string): Promise<boolean> {
  const limits = await getUserLimits(db, userId);
  return limits.canAccessPremiumPlans;
}

/**
 * 检查用户是否可以导出数据
 */
export async function canExportData(db: D1Database, userId: string): Promise<boolean> {
  const limits = await getUserLimits(db, userId);
  return limits.canExportData;
}