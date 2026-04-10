-- FitPlan Pro 移除 Premium 会员等级迁移
-- 执行时间: 2026-04-10
-- 说明: 移除 Premium 等级，只保留 Free 和 Pro

-- =====================
-- 1. 更新 Pro 等级配置
-- =====================
-- 将 Pro 等级功能提升为原来 Premium 的功能
UPDATE membership_tiers
SET
  features_json = '[{"key":"basic_plans","name":"Basic Plans","nameZh":"基础训练计划","included":true},{"key":"basic_timer","name":"Basic Timer","nameZh":"基础计时器","included":true},{"key":"progress_tracking","name":"Progress Tracking","nameZh":"进度追踪","included":true},{"key":"ai_generation","name":"AI Plan Generation","nameZh":"AI智能生成（无限）","included":true,"highlight":true},{"key":"premium_plans","name":"Premium Plans","nameZh":"高级计划","included":true},{"key":"data_export","name":"Data Export","nameZh":"数据导出","included":true}]',
  limits_json = '{"plansPerMonth":-1,"aiGenerationsPerDay":-1,"customPlans":-1,"progressHistory":-1,"bodyMetricsRecords":-1,"canAccessPremiumPlans":true,"canExportData":true,"canSyncWearable":true,"priority":1}'
WHERE id = 'pro';

-- =====================
-- 2. 删除 Premium 等级
-- =====================
DELETE FROM membership_tiers WHERE id = 'premium';

-- =====================
-- 3. 将 Premium 用户迁移到 Pro
-- =====================
-- 将所有 premium 用户降级到 pro
UPDATE users SET membership_tier = 'pro' WHERE membership_tier = 'premium';

-- 更新订阅记录中的 tier_id
UPDATE user_subscriptions SET tier_id = 'pro' WHERE tier_id = 'premium';

-- =====================
-- 4. 更新支付记录中的 tier_id
-- =====================
UPDATE payment_records SET tier_id = 'pro' WHERE tier_id = 'premium';

-- =====================
-- 5. 更新时间戳
-- =====================
UPDATE membership_tiers SET updated_at = datetime('now') WHERE id = 'pro';