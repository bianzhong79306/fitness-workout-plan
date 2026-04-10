-- 用户设置迁移
-- 添加周训练目标字段

-- 添加每周训练目标（默认3次）
ALTER TABLE users ADD COLUMN weekly_workout_goal INTEGER DEFAULT 3;

-- 添加索引（如果需要）
-- CREATE INDEX IF NOT EXISTS idx_users_weekly_goal ON users(weekly_workout_goal);