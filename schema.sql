DROP TABLE IF EXISTS searches;
DROP TABLE IF EXISTS search_results;

CREATE TABLE searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  country_code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  search_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(search_id) REFERENCES searches(id)
);

CREATE INDEX idx_searches_keyword ON searches(keyword);
CREATE INDEX idx_search_results_search_id ON search_results(search_id);