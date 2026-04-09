-- FitPlan Pro 会员系统迁移
-- 执行时间: 2026-04-09
-- 说明: 添加会员等级表、用户订阅表，更新用户表

-- =====================
-- 1. 会员等级配置表
-- =====================
CREATE TABLE IF NOT EXISTS membership_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  price_monthly REAL DEFAULT 0,
  price_yearly REAL DEFAULT 0,
  features_json TEXT NOT NULL,
  limits_json TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================
-- 2. 用户订阅表
-- =====================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tier_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TEXT NOT NULL,
  expires_at TEXT,
  cancelled_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tier_id) REFERENCES membership_tiers(id)
);

-- =====================
-- 3. 用户表添加会员字段
-- =====================
-- SQLite 不支持 IF NOT EXISTS for columns，使用 try-catch
ALTER TABLE users ADD COLUMN membership_tier TEXT DEFAULT 'free';

-- =====================
-- 4. 索引
-- =====================
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires ON user_subscriptions(expires_at);

-- =====================
-- 5. 初始化会员等级数据
-- =====================
INSERT OR REPLACE INTO membership_tiers (id, name, name_zh, price_monthly, price_yearly, features_json, limits_json, is_active)
VALUES 
(
  'free',
  'Free',
  '免费用户',
  0,
  0,
  '[{"key":"basic_plans","name":"Basic Plans","nameZh":"基础训练计划","included":true},{"key":"basic_timer","name":"Basic Timer","nameZh":"基础计时器","included":true},{"key":"progress_tracking","name":"Progress Tracking","nameZh":"进度追踪","included":true},{"key":"ai_generation","name":"AI Plan Generation","nameZh":"AI智能生成","included":false},{"key":"premium_plans","name":"Premium Plans","nameZh":"高级计划","included":false},{"key":"data_export","name":"Data Export","nameZh":"数据导出","included":false}]',
  '{"plansPerMonth":3,"aiGenerationsPerDay":1,"customPlans":1,"progressHistory":30,"bodyMetricsRecords":50,"canAccessPremiumPlans":false,"canExportData":false,"canSyncWearable":false,"priority":0}',
  1
),
(
  'pro',
  'Pro',
  '专业会员',
  9.99,
  79.99,
  '[{"key":"basic_plans","name":"Basic Plans","nameZh":"基础训练计划","included":true},{"key":"basic_timer","name":"Basic Timer","nameZh":"基础计时器","included":true},{"key":"progress_tracking","name":"Progress Tracking","nameZh":"进度追踪","included":true},{"key":"ai_generation","name":"AI Plan Generation","nameZh":"AI智能生成","included":true,"highlight":true},{"key":"premium_plans","name":"Premium Plans","nameZh":"高级计划","included":true},{"key":"data_export","name":"Data Export","nameZh":"数据导出","included":false}]',
  '{"plansPerMonth":20,"aiGenerationsPerDay":10,"customPlans":10,"progressHistory":365,"bodyMetricsRecords":500,"canAccessPremiumPlans":true,"canExportData":false,"canSyncWearable":false,"priority":1}',
  1
),
(
  'premium',
  'Premium',
  '高级会员',
  19.99,
  159.99,
  '[{"key":"basic_plans","name":"Basic Plans","nameZh":"基础训练计划","included":true},{"key":"basic_timer","name":"Basic Timer","nameZh":"基础计时器","included":true},{"key":"progress_tracking","name":"Progress Tracking","nameZh":"进度追踪","included":true},{"key":"ai_generation","name":"AI Plan Generation","nameZh":"AI智能生成（无限）","included":true,"highlight":true},{"key":"premium_plans","name":"Premium Plans","nameZh":"高级计划","included":true},{"key":"data_export","name":"Data Export","nameZh":"数据导出","included":true}]',
  '{"plansPerMonth":-1,"aiGenerationsPerDay":-1,"customPlans":-1,"progressHistory":-1,"bodyMetricsRecords":-1,"canAccessPremiumPlans":true,"canExportData":true,"canSyncWearable":true,"priority":2}',
  1
);

-- =====================
-- 6. 更新现有用户默认会员等级
-- =====================
UPDATE users SET membership_tier = 'free' WHERE membership_tier IS NULL;