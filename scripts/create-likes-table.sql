-- Create portfolio_likes table
CREATE TABLE IF NOT EXISTS portfolio_likes (
  id          bigserial PRIMARY KEY,
  count       integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Insert the single counter row if it doesn't exist yet
INSERT INTO portfolio_likes (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the counter (public portfolio)
CREATE POLICY "public_read_likes"
  ON portfolio_likes
  FOR SELECT
  USING (true);

-- Allow anyone (anon) to increment the counter via UPDATE
CREATE POLICY "public_increment_likes"
  ON portfolio_likes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
