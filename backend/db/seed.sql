-- Seed data for testing universities and courses features
-- Run this after creating a user account in the app

-- Add some universities
INSERT INTO universities (name, city, country, description) VALUES
  ('University of Barcelona', 'Barcelona', 'Spain', 'Historic university in the heart of Barcelona'),
  ('Pontifical Catholic University of Chile', 'Santiago', 'Chile', 'Leading university in Latin America'),
  ('University of Sydney', 'Sydney', 'Australia', 'Australia''s first university'),
  ('National University of Singapore', 'Singapore', 'Singapore', 'Top-ranked Asian university'),
  ('University of Tokyo', 'Tokyo', 'Japan', 'Japan''s most prestigious university'),
  ('Technical University of Denmark', 'Lyngby', 'Denmark', 'Leading technical university in Scandinavia')
ON CONFLICT (name, city, country) DO NOTHING;

-- Add courses (now university-specific with university_id)
-- Barcelona courses
INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Advanced Spanish Language', 'SPAN 301', 'Intensive Spanish language course'
FROM universities WHERE name = 'University of Barcelona'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Art History: Renaissance', 'ART 310', 'Study of Renaissance art and architecture'
FROM universities WHERE name = 'University of Barcelona'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'International Business', 'BUS 450', 'Global business strategies and practices'
FROM universities WHERE name = 'University of Barcelona'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

-- Chile courses
INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Advanced Spanish Language', 'SPAN 301', 'Intensive Spanish language course'
FROM universities WHERE name = 'Pontifical Catholic University of Chile'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Latin American History', 'HIST 250', 'Survey of Latin American historical development'
FROM universities WHERE name = 'Pontifical Catholic University of Chile'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Environmental Science', 'ENVS 220', 'Environmental issues and sustainability'
FROM universities WHERE name = 'Pontifical Catholic University of Chile'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

-- Sydney courses
INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Marine Biology', 'BIOL 350', 'Study of ocean ecosystems and marine life'
FROM universities WHERE name = 'University of Sydney'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Environmental Science', 'ENVS 220', 'Environmental issues and sustainability'
FROM universities WHERE name = 'University of Sydney'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'International Business', 'BUS 450', 'Global business strategies and practices'
FROM universities WHERE name = 'University of Sydney'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

-- Singapore courses
INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Asian Studies', 'ASIA 200', 'Introduction to Asian cultures and societies'
FROM universities WHERE name = 'National University of Singapore'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Computer Science Fundamentals', 'CS 101', 'Introduction to programming and algorithms'
FROM universities WHERE name = 'National University of Singapore'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'International Business', 'BUS 450', 'Global business strategies and practices'
FROM universities WHERE name = 'National University of Singapore'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

-- Tokyo courses
INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Asian Studies', 'ASIA 200', 'Introduction to Asian cultures and societies'
FROM universities WHERE name = 'University of Tokyo'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Computer Science Fundamentals', 'CS 101', 'Introduction to programming and algorithms'
FROM universities WHERE name = 'University of Tokyo'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

-- Denmark courses
INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Renewable Energy Systems', 'ENG 340', 'Wind turbines, solar energy, and sustainable power'
FROM universities WHERE name = 'Technical University of Denmark'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Data Science and Machine Learning', 'CS 450', 'Advanced ML techniques and big data analytics'
FROM universities WHERE name = 'Technical University of Denmark'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Biomedical Engineering', 'BME 310', 'Medical devices and biotechnology applications'
FROM universities WHERE name = 'Technical University of Denmark'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

INSERT INTO courses (university_id, subject_name, course_code, description)
SELECT id, 'Sustainable Architecture', 'ARCH 280', 'Green building design and urban planning'
FROM universities WHERE name = 'Technical University of Denmark'
ON CONFLICT (university_id, subject_name, course_code) DO NOTHING;

-- Note: Reviews need to be added through the app by authenticated users
