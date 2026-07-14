-- MemorIAmobile MySQL schema (replaces PocketBase)

CREATE TABLE IF NOT EXISTS schema_migrations (
  id VARCHAR(255) PRIMARY KEY,
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id CHAR(15) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  name VARCHAR(255) NOT NULL DEFAULT '',
  avatar_path VARCHAR(512) NULL,
  theme VARCHAR(16) NOT NULL DEFAULT 'light',
  google_id VARCHAR(255) NULL,
  apple_id VARCHAR(255) NULL,
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_google (google_id),
  UNIQUE KEY uq_users_apple (apple_id)
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_oauth_provider (provider, provider_user_id),
  KEY idx_oauth_user (user_id),
  CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  token_hash VARCHAR(128) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_prt_user (user_id),
  KEY idx_prt_hash (token_hash),
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memories (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  title VARCHAR(255) NULL,
  description TEXT NULL,
  date DATETIME NULL,
  location VARCHAR(255) NULL,
  people JSON NULL,
  tags JSON NULL,
  content TEXT NULL,
  file_path VARCHAR(512) NULL,
  video_file_path VARCHAR(512) NULL,
  file_type VARCHAR(100) NULL,
  file_type_extracted VARCHAR(100) NULL,
  event_category VARCHAR(32) NULL,
  file_size_bytes BIGINT NULL,
  video_duration DOUBLE NULL,
  video_metadata JSON NULL,
  user_notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_memories_user (user_id),
  KEY idx_memories_date (user_id, date),
  CONSTRAINT fk_memories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS files (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  filename VARCHAR(512) NULL,
  file_path VARCHAR(512) NULL,
  file_type VARCHAR(127) NULL,
  file_size BIGINT NULL,
  upload_date DATETIME NULL,
  folder VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_files_user (user_id),
  CONSTRAINT fk_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stories (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  title VARCHAR(512) NULL,
  content LONGTEXT NULL,
  memories_used JSON NULL,
  tone VARCHAR(64) NULL,
  length VARCHAR(64) NULL,
  style VARCHAR(64) NULL,
  story_format VARCHAR(64) NULL,
  generated_by_ai TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_stories_user (user_id),
  CONSTRAINT fk_stories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS family_members (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'viewer',
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  joined_date DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_family_user (user_id),
  CONSTRAINT fk_family_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS devices (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  device_name VARCHAR(255) NOT NULL,
  connection_type VARCHAR(32) NOT NULL,
  external_device_id VARCHAR(64) NULL,
  connection_token VARCHAR(128) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'connected',
  last_sync_time DATETIME NULL,
  file_count INT NOT NULL DEFAULT 0,
  storage_info JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_devices_user (user_id),
  CONSTRAINT fk_devices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sync_logs (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  device_id CHAR(15) NULL,
  sync_start_time DATETIME NULL,
  sync_end_time DATETIME NULL,
  files_count INT NULL,
  files_synced INT NULL,
  files_failed INT NULL,
  sync_status VARCHAR(32) NULL,
  sync_type VARCHAR(64) NULL,
  error_message TEXT NULL,
  sync_speed DOUBLE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_sync_logs_user (user_id),
  CONSTRAINT fk_sync_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS synced_files (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  device_id CHAR(15) NULL,
  file_name VARCHAR(512) NULL,
  file_size BIGINT NULL,
  file_hash VARCHAR(128) NULL,
  file_type VARCHAR(127) NULL,
  synced_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_synced_files_user (user_id),
  UNIQUE KEY uq_synced_hash (user_id, file_hash),
  CONSTRAINT fk_synced_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contacts (
  id CHAR(15) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  analysis_id VARCHAR(64) NULL,
  file_id CHAR(15) NULL,
  file_name VARCHAR(512) NULL,
  status VARCHAR(32) NULL,
  detected_objects JSON NULL,
  detected_people JSON NULL,
  emotions JSON NULL,
  suggested_tags JSON NULL,
  tags JSON NULL,
  location VARCHAR(255) NULL,
  ocr_text TEXT NULL,
  event_type VARCHAR(128) NULL,
  confidence DOUBLE NULL,
  raw_analysis LONGTEXT NULL,
  error TEXT NULL,
  analysis_timestamp DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_analysis_user (user_id),
  CONSTRAINT fk_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS batch_analyses (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  analysis_id VARCHAR(64) NULL,
  file_ids JSON NULL,
  status VARCHAR(32) NULL,
  total_files INT NULL,
  completed_files INT NULL,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  error TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_batch_user (user_id),
  CONSTRAINT fk_batch_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS story_exports (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  story_id CHAR(15) NULL,
  export_type VARCHAR(32) NULL,
  format VARCHAR(16) NULL,
  resolution VARCHAR(16) NULL,
  frame_rate INT NULL,
  quality VARCHAR(32) NULL,
  include_music TINYINT(1) NULL,
  music_volume DOUBLE NULL,
  page_size VARCHAR(16) NULL,
  orientation VARCHAR(16) NULL,
  text_settings JSON NULL,
  transition_type VARCHAR(32) NULL,
  duration INT NULL,
  platform VARCHAR(32) NULL,
  dimensions JSON NULL,
  status VARCHAR(32) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_exports_user (user_id),
  CONSTRAINT fk_exports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NOT NULL,
  role VARCHAR(32) NOT NULL,
  content JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_ai_msg_user (user_id, created_at),
  CONSTRAINT fk_ai_msg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_images (
  id CHAR(15) NOT NULL PRIMARY KEY,
  user_id CHAR(15) NULL,
  file_path VARCHAR(512) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
