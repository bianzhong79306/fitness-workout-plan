-- FitPlan Pro 数据库迁移SQL
-- 用于Cloudflare D1数据库初始化

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  fitness_goal TEXT,
  fitness_level TEXT,
  membership_tier TEXT DEFAULT 'free',
  weekly_workout_goal INTEGER DEFAULT 3,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- 身体数据记录表
CREATE TABLE IF NOT EXISTS body_metrics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  weight REAL,
  body_fat REAL,
  height REAL,
  chest REAL,
  waist REAL,
  hip REAL,
  arm REAL,
  thigh REAL,
  recorded_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 训练计划表
CREATE TABLE IF NOT EXISTS workout_plans (
  id TEXT PRIMARY KEY,
  creator_id TEXT,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  goal TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_weeks INTEGER DEFAULT 4,
  sessions_per_week INTEGER DEFAULT 3,
  equipment TEXT,
  is_premium BOOLEAN DEFAULT 0,
  is_published BOOLEAN DEFAULT 1,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 训练课程表
CREATE TABLE IF NOT EXISTS workout_sessions (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  session_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  duration_minutes INTEGER,
  exercises_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (plan_id) REFERENCES workout_plans(id)
);

-- 训练记录表
CREATE TABLE IF NOT EXISTS workout_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT,
  plan_id TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  duration_seconds INTEGER,
  exercises_json TEXT,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  notes TEXT,
  rating INTEGER,
  calories_burned REAL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id),
  FOREIGN KEY (plan_id) REFERENCES workout_plans(id)
);

-- 用户计划订阅表
CREATE TABLE IF NOT EXISTS user_plan_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  started_at TEXT DEFAULT (datetime('now')),
  current_week INTEGER DEFAULT 1,
  completed_sessions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES workout_plans(id)
);

-- 会员等级配置表
CREATE TABLE IF NOT EXISTS membership_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  price_monthly REAL DEFAULT 0,
  price_yearly REAL DEFAULT 0,
  features_json TEXT NOT NULL,
  limits_json TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 用户订阅表
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tier_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,
  cancelled_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 成就表
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_body_metrics_user ON body_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user ON user_plan_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- 力量进步记录表
CREATE TABLE IF NOT EXISTS exercise_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  weight REAL,
  reps INTEGER,
  sets INTEGER,
  one_rep_max REAL,
  notes TEXT,
  recorded_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_user ON exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise ON exercise_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_date ON exercise_progress(recorded_at);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_exercise ON exercise_progress(user_id, exercise_id);

-- 支付记录表
CREATE TABLE IF NOT EXISTS payment_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  capture_id TEXT,
  order_id TEXT,
  reference_id TEXT,
  tier_id TEXT NOT NULL,
  amount TEXT,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed',
  refunded_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_payment_records_user ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_capture ON payment_records(capture_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status);

-- 社区动态表
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'general',
  workout_id TEXT,
  plan_id TEXT,
  workout_duration INTEGER,
  workout_sets INTEGER,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (workout_id) REFERENCES workout_logs(id),
  FOREIGN KEY (plan_id) REFERENCES workout_plans(id)
);

-- 评论表
CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES community_comments(id)
);

-- 点赞表
CREATE TABLE IF NOT EXISTS community_likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES community_posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(post_id, user_id)
);

-- 成就定义表
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 社区索引
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);