-- Initialize database schema for UWAbroad

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  city TEXT,
  country TEXT,
  term TEXT NOT NULL,
  budget INTEGER,
  currency TEXT,
  language TEXT,
  summary TEXT,
  rating NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_university ON profiles (university);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles (city);
CREATE INDEX IF NOT EXISTS idx_profiles_term ON profiles (term);
CREATE INDEX IF NOT EXISTS idx_profiles_budget ON profiles (budget);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_profile_id ON posts (profile_id);

-- Images attached to posts
CREATE TABLE IF NOT EXISTS post_images (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_images_post_id ON post_images (post_id);

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(name, city, country)
);

CREATE INDEX IF NOT EXISTS idx_universities_name ON universities (name);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities (country);

-- Courses table (university-specific)
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  course_code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(university_id, subject_name, course_code)
);

CREATE INDEX IF NOT EXISTS idx_courses_university ON courses (university_id);
CREATE INDEX IF NOT EXISTS idx_courses_subject_name ON courses (subject_name);

-- University reviews
CREATE TABLE IF NOT EXISTS university_reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  university_id INTEGER NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_university_reviews_university ON university_reviews (university_id);
CREATE INDEX IF NOT EXISTS idx_university_reviews_user ON university_reviews (user_id);

-- Course reviews (no longer need university_id since courses are university-specific)
CREATE TABLE IF NOT EXISTS course_reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  enjoyability NUMERIC NOT NULL CHECK (enjoyability >= 1 AND enjoyability <= 5),
  difficulty NUMERIC NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews (course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_user ON course_reviews (user_id);
