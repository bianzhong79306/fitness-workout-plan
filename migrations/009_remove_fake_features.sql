-- FitPlan Pro 2.0 删除虚假功能迁移
-- 执行时间: 2026-04-11
-- 说明: 删除挑战赛系统、成就系统相关表

-- =====================
-- 1. 删除挑战赛系统表
-- =====================
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS user_challenges;
DROP TABLE IF EXISTS challenge_leaderboard;

-- =====================
-- 2. 删除成就系统表
-- =====================
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS user_achievements;

-- =====================
-- 3. 清理相关索引
-- =====================
DROP INDEX IF EXISTS idx_challenges_type;
DROP INDEX IF EXISTS idx_challenges_active;
DROP INDEX IF EXISTS idx_challenges_dates;
DROP INDEX IF EXISTS idx_user_challenges_user;
DROP INDEX IF EXISTS idx_user_challenges_challenge;
DROP INDEX IF EXISTS idx_user_challenges_status;
DROP INDEX IF EXISTS idx_user_achievements_user;
DROP INDEX IF EXISTS idx_user_achievements_achievement;
DROP INDEX IF EXISTS idx_challenge_leaderboard_challenge;
DROP INDEX IF EXISTS idx_challenge_leaderboard_user;