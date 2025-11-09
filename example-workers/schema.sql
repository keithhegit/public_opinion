-- BettaFish D1 数据库 Schema

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 分析任务表
CREATE TABLE IF NOT EXISTS analysis_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  query TEXT NOT NULL,
  status TEXT NOT NULL,  -- pending, processing, completed, failed
  result TEXT,           -- JSON格式的结果
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 情感分析结果表
CREATE TABLE IF NOT EXISTS sentiment_results (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  text TEXT NOT NULL,
  sentiment TEXT NOT NULL,  -- positive, negative, neutral
  confidence REAL NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (task_id) REFERENCES analysis_tasks(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_analysis_tasks_user_id ON analysis_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_tasks_status ON analysis_tasks(status);
CREATE INDEX IF NOT EXISTS idx_sentiment_results_task_id ON sentiment_results(task_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_results_text ON sentiment_results(text);

