-- Supabase users 테이블 생성 (수정된 버전)
-- SQL Editor에서 실행하세요

-- 기존 테이블과 정책이 있다면 삭제
DROP TABLE IF EXISTS users CASCADE;

-- users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화 (하지만 모든 접근 허용)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 사용자가 조회 가능 (개발 단계)
CREATE POLICY "Anyone can view users"
  ON users
  FOR SELECT
  USING (true);

-- 정책: 모든 사용자가 삽입 가능 (개발 단계)
CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- 정책: 모든 사용자가 업데이트 가능 (개발 단계)
CREATE POLICY "Anyone can update users"
  ON users
  FOR UPDATE
  USING (true);

-- 인덱스 생성
CREATE INDEX users_email_idx ON users(email);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
