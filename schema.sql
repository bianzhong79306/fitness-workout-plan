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