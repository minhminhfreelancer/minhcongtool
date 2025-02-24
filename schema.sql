DROP TABLE IF EXISTS searches;

CREATE TABLE searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  country_code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  results_count INTEGER DEFAULT 0
);

CREATE INDEX idx_searches_keyword ON searches(keyword);
CREATE INDEX idx_searches_created_at ON searches(created_at);
