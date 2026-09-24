-- Profile pictures: a small version counter on users (bumped on every change, used to cache-bust
-- the public avatar URL) and the image bytes in their own table, out of the hot users row.
ALTER TABLE users ADD COLUMN avatar_ver INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS avatars (
  user_id      TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  data         BLOB NOT NULL,
  updated_at   INTEGER NOT NULL
);
