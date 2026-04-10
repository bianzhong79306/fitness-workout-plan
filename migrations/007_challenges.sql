-- 挑战赛系统迁移
-- 支持每日、每周、每月、社区挑战

-- 挑战定义表
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon TEXT DEFAULT 'target',
  challenge_type TEXT NOT NULL,  -- 'daily', 'weekly', 'monthly', 'community'
  goal_type TEXT NOT NULL,       -- 'workouts', 'duration', 'sets', 'streak_days', 'community_total'
  goal_value INTEGER NOT NULL,   -- 目标数值
  reward_points INTEGER DEFAULT 0,
  reward_achievement_id TEXT,    -- 完成后解锁的成就ID
  start_at TEXT NOT NULL,        -- 挑战开始时间
  end_at TEXT NOT NULL,          -- 挑战结束时间
  is_active BOOLEAN DEFAULT 1,
  is_system BOOLEAN DEFAULT 0,   -- 系统预设 vs 管理员创建
  participants_count INTEGER DEFAULT 0,  -- 参与人数（缓存）
  completions_count INTEGER DEFAULT 0,   -- 完成人数（缓存）
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (reward_achievement_id) REFERENCES achievements(id)
);

-- 用户挑战参与表
CREATE TABLE IF NOT EXISTS user_challenges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',  -- 'active', 'completed', 'expired'
  current_progress INTEGER DEFAULT 0,
  target_progress INTEGER NOT NULL,  -- 复制自challenge.goal_value
  joined_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  last_progress_at TEXT,
  reward_claimed BOOLEAN DEFAULT 0,
  reward_claimed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id),
  UNIQUE(user_id, challenge_id)
);

-- 社区挑战排行榜
CREATE TABLE IF NOT EXISTS challenge_leaderboard (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  contribution INTEGER DEFAULT 0,  -- 个人贡献值
  rank INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(challenge_id, user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(challenge_type);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);
CREATE INDEX IF NOT EXISTS idx_leaderboard_challenge ON challenge_leaderboard(challenge_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON challenge_leaderboard(challenge_id, rank);

-- 插入系统预设挑战
INSERT OR IGNORE INTO challenges (id, name, name_en, description, description_en, icon, challenge_type, goal_type, goal_value, reward_points, start_at, end_at, is_system)
VALUES
  ('daily-workout', '每日训练', 'Daily Workout', '今天完成一次训练', 'Complete a workout today', 'calendar', 'daily', 'workouts', 1, 10, datetime('now', 'start of day'), datetime('now', 'start of day', '+1 day'), 1),
  ('weekly-3-workouts', '周计划达成', 'Weekly Goal', '本周完成3次训练', 'Complete 3 workouts this week', 'target', 'weekly', 'workouts', 3, 30, datetime('now', 'weekday 0', '-6 days'), datetime('now', 'weekday 0', '+1 day'), 1),
  ('weekly-5-workouts', '健身狂人', 'Fitness Enthusiast', '本周完成5次训练', 'Complete 5 workouts this week', 'flame', 'weekly', 'workouts', 5, 50, datetime('now', 'weekday 0', '-6 days'), datetime('now', 'weekday 0', '+1 day'), 1),
  ('monthly-15-days', '月度坚持', 'Monthly Dedication', '本月训练15天', 'Train on 15 days this month', 'medal', 'monthly', 'streak_days', 15, 100, datetime('now', 'start of month'), datetime('now', 'start of month', '+1 month'), 1),
  ('community-1000', '社区挑战', 'Community Challenge', '一起完成1000次训练', 'Together we complete 1000 workouts', 'users', 'community', 'community_total', 1000, 20, datetime('now'), datetime('now', '+30 days'), 1);