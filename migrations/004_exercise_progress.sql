-- 力量进步记录迁移
-- 记录用户每个动作的重量/次数进步数据

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user ON exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise ON exercise_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_date ON exercise_progress(recorded_at);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_exercise ON exercise_progress(user_id, exercise_id);