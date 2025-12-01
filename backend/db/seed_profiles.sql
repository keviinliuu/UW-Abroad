-- Seed fake study abroad profiles
-- Note: These profiles use user_id 1. Make sure you have a user account created first.
-- You can run this with: psql "postgres://uwabroad:uwabroadpass@localhost:5433/uwabroad" -f backend/db/seed_profiles.sql

-- Get or create a default user for these profiles
INSERT INTO users (first_name, last_name, email, password_hash)
VALUES ('Demo', 'User', 'demo@uwabroad.com', '$2b$10$rQ5Y5Y5Y5Y5Y5Y5Y5Y5Y5e')
ON CONFLICT (email) DO NOTHING;

-- Insert 10 diverse study abroad profiles
INSERT INTO profiles (user_id, name, university, city, country, term, budget, currency, language, summary, rating) VALUES
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Emma Rodriguez',
  'University of Barcelona',
  'Barcelona',
  'Spain',
  'Fall 2024',
  7500,
  'USD',
  'Spanish, Catalan',
  'Incredible semester studying architecture and design in Barcelona! The city''s blend of Gothic and modernist architecture provided endless inspiration. Took amazing courses on Gaudí and urban planning while improving my Spanish.',
  4.8
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Marcus Chen',
  'National University of Singapore',
  'Singapore',
  'Singapore',
  'Spring 2024',
  12000,
  'USD',
  'English, Mandarin',
  'Singapore was the perfect hub for exploring Southeast Asia while taking cutting-edge CS courses. The tech scene here is incredible, and I landed an internship at a local startup. Mix of cultures made every day exciting.',
  5.0
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Sophie Müller',
  'University of Sydney',
  'Sydney',
  'Australia',
  'Summer 2024',
  9000,
  'AUD',
  'English',
  'Best summer ever! Studied marine biology at Bondi Beach and spent weekends exploring the Blue Mountains. The Australian university system gave me so much hands-on research experience. Can''t recommend Sydney enough!',
  4.9
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'James O''Connor',
  'University of Tokyo',
  'Tokyo',
  'Japan',
  'Fall 2023',
  10500,
  'USD',
  'Japanese, English',
  'Tokyo exceeded all expectations. Studied Japanese culture and business while living in Shibuya. The contrast between ancient temples and ultra-modern technology was fascinating. Made lifelong friends from around the world.',
  4.7
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Aisha Patel',
  'Pontifical Catholic University of Chile',
  'Santiago',
  'Chile',
  'Spring 2025',
  6500,
  'USD',
  'Spanish, English',
  'Currently studying sustainable development in Santiago! The proximity to both the Andes and Pacific coast is unreal. Taking amazing courses on Latin American environmental policy and working on a community project in Valparaíso.',
  4.6
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Liam Thompson',
  'University of Barcelona',
  'Barcelona',
  'Spain',
  'Spring 2024',
  8200,
  'EUR',
  'Spanish, English',
  'Studied international business in Barcelona - couldn''t have picked a better city! The entrepreneurship scene is booming, and I connected with so many startups. Weekend trips to other Spanish cities were easy and affordable.',
  4.5
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Yuki Tanaka',
  'University of Sydney',
  'Sydney',
  'Australia',
  'Fall 2024',
  11000,
  'AUD',
  'English, Japanese',
  'As an exchange student from Japan, Sydney felt like home but with endless beaches! Studied environmental science and volunteered with local conservation groups. The campus is beautiful and everyone was so welcoming.',
  4.8
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Isabella Costa',
  'National University of Singapore',
  'Singapore',
  'Singapore',
  'Fall 2023',
  10000,
  'SGD',
  'English, Portuguese, Mandarin',
  'Singapore is a student''s dream - safe, clean, and incredibly diverse. Studied AI and machine learning with world-class professors. The food scene alone is worth the trip! Used it as a base to explore Thailand, Vietnam, and Indonesia.',
  5.0
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Noah Williams',
  'University of Tokyo',
  'Tokyo',
  'Japan',
  'Spring 2024',
  13000,
  'USD',
  'Japanese',
  'Studying animation and media arts in Tokyo was surreal. Got to visit actual anime studios and learn from industry professionals. The city never sleeps and there''s always something new to discover. My Japanese improved dramatically!',
  4.9
),
(
  (SELECT id FROM users WHERE email = 'demo@uwabroad.com'),
  'Zara Ahmed',
  'Pontifical Catholic University of Chile',
  'Santiago',
  'Chile',
  'Fall 2024',
  7000,
  'USD',
  'Spanish',
  'Santiago surprised me in the best way! The university has amazing faculty and the Chilean students were incredibly friendly. Hiked Cerro San Cristóbal every weekend. The Spanish immersion really pushed my language skills to the next level.',
  4.7
);

-- Verify insertion
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT name, university, city, term FROM profiles ORDER BY created_at DESC;
