-- 支付记录迁移
-- 存储PayPal支付记录，用于退款追踪

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_payment_records_user ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_capture ON payment_records(capture_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status);