-- Seed reviews and posts by the fake students
-- Creates user accounts for each student, reassigns profiles to those users,
-- inserts university_reviews, course_reviews, posts and one image per post.

-- 1) Create individual user accounts for each fake student (password_hash is placeholder)
INSERT INTO users (first_name, last_name, email, password_hash)
VALUES
  ('Emma','Rodriguez','emma.rodriguez@fake.edu','$2b$10$placeholderhash1111111111111111111111'),
  ('Marcus','Chen','marcus.chen@fake.edu','$2b$10$placeholderhash2222222222222222222222'),
  ('Sophie','Müller','sophie.muller@fake.edu','$2b$10$placeholderhash3333333333333333333333'),
  ('James','O''Connor','james.oconnor@fake.edu','$2b$10$placeholderhash4444444444444444444444'),
  ('Aisha','Patel','aisha.patel@fake.edu','$2b$10$placeholderhash5555555555555555555555'),
  ('Liam','Thompson','liam.thompson@fake.edu','$2b$10$placeholderhash6666666666666666666666'),
  ('Yuki','Tanaka','yuki.tanaka@fake.edu','$2b$10$placeholderhash7777777777777777777777'),
  ('Isabella','Costa','isabella.costa@fake.edu','$2b$10$placeholderhash8888888888888888888888'),
  ('Noah','Williams','noah.williams@fake.edu','$2b$10$placeholderhash9999999999999999999999'),
  ('Zara','Ahmed','zara.ahmed@fake.edu','$2b$10$placeholderhash0000000000000000000000')
ON CONFLICT (email) DO NOTHING;

-- 2) Reassign each profile to its newly created user
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'emma.rodriguez@fake.edu') WHERE name = 'Emma Rodriguez';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'marcus.chen@fake.edu') WHERE name = 'Marcus Chen';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'sophie.muller@fake.edu') WHERE name = 'Sophie Müller';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'james.oconnor@fake.edu') WHERE name = 'James O''Connor';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'aisha.patel@fake.edu') WHERE name = 'Aisha Patel';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'liam.thompson@fake.edu') WHERE name = 'Liam Thompson';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'yuki.tanaka@fake.edu') WHERE name = 'Yuki Tanaka';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'isabella.costa@fake.edu') WHERE name = 'Isabella Costa';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'noah.williams@fake.edu') WHERE name = 'Noah Williams';
UPDATE profiles SET user_id = (SELECT id FROM users WHERE email = 'zara.ahmed@fake.edu') WHERE name = 'Zara Ahmed';

-- 3) Insert university reviews (one per profile)
INSERT INTO university_reviews (user_id, university_id, rating, review_text)
VALUES
  ((SELECT id FROM users WHERE email='emma.rodriguez@fake.edu'), (SELECT id FROM universities WHERE name='University of Barcelona'), 5, 'Amazing faculty and architecture courses — Gaudí field trips were the highlight.'),
  ((SELECT id FROM users WHERE email='marcus.chen@fake.edu'), (SELECT id FROM universities WHERE name='National University of Singapore'), 5, 'Top-notch CS department and great industry connections. Loved the campus life.'),
  ((SELECT id FROM users WHERE email='sophie.muller@fake.edu'), (SELECT id FROM universities WHERE name='University of Sydney'), 5, 'Hands-on marine labs and supportive professors. Beaches after class were unbeatable.'),
  ((SELECT id FROM users WHERE email='james.oconnor@fake.edu'), (SELECT id FROM universities WHERE name='University of Tokyo'), 4, 'Fast-paced and intense but extremely rewarding, especially cultural immersion.'),
  ((SELECT id FROM users WHERE email='aisha.patel@fake.edu'), (SELECT id FROM universities WHERE name='Pontifical Catholic University of Chile'), 4, 'Great program for sustainability; small classes and wonderful community projects.'),
  ((SELECT id FROM users WHERE email='liam.thompson@fake.edu'), (SELECT id FROM universities WHERE name='University of Barcelona'), 4, 'Excellent business modules and startup scene; very international.'),
  ((SELECT id FROM users WHERE email='yuki.tanaka@fake.edu'), (SELECT id FROM universities WHERE name='University of Sydney'), 5, 'Welcoming campus and strong environmental programs. Loved volunteering with conservation groups.'),
  ((SELECT id FROM users WHERE email='isabella.costa@fake.edu'), (SELECT id FROM universities WHERE name='National University of Singapore'), 5, 'Rigorous courses and wonderful professors in AI/ML. The food hawker culture is unbeatable.'),
  ((SELECT id FROM users WHERE email='noah.williams@fake.edu'), (SELECT id FROM universities WHERE name='University of Tokyo'), 5, 'Incredible creative scene for animation students — studios and industry contacts were accessible.'),
  ((SELECT id FROM users WHERE email='zara.ahmed@fake.edu'), (SELECT id FROM universities WHERE name='Pontifical Catholic University of Chile'), 4, 'Friendly students and great outdoor activities; language immersion really helped.')
ON CONFLICT DO NOTHING;

-- 4) Insert course reviews (one per student). Use course id lookup by subject and university.
-- Emma: Advanced Spanish Language @ University of Barcelona
INSERT INTO course_reviews (user_id, course_id, rating, enjoyability, difficulty, review_text)
VALUES
  ((SELECT id FROM users WHERE email='emma.rodriguez@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Advanced Spanish Language' AND u.name='University of Barcelona' LIMIT 1), 5, 5, 3, 'Intensive but the immersion and class activities helped me speak confidently.'),
  ((SELECT id FROM users WHERE email='marcus.chen@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Computer Science Fundamentals' AND u.name='National University of Singapore' LIMIT 1), 5, 5, 4, 'Great intro with strong emphasis on algorithms and practical labs.'),
  ((SELECT id FROM users WHERE email='sophie.muller@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Marine Biology' AND u.name='University of Sydney' LIMIT 1), 5, 5, 4, 'Field trips and lab work were exceptional — I learned so much hands-on.'),
  ((SELECT id FROM users WHERE email='james.oconnor@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Asian Studies' AND u.name='University of Tokyo' LIMIT 1), 4, 4, 3, 'Excellent historical context; some readings were very dense.'),
  ((SELECT id FROM users WHERE email='aisha.patel@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Environmental Science' AND u.name='Pontifical Catholic University of Chile' LIMIT 1), 4, 4, 3, 'Great local case studies and community projects.'),
  ((SELECT id FROM users WHERE email='liam.thompson@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='International Business' AND u.name='University of Barcelona' LIMIT 1), 4, 4, 3, 'Good mix of theory and practical startup case studies.'),
  ((SELECT id FROM users WHERE email='yuki.tanaka@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Environmental Science' AND u.name='University of Sydney' LIMIT 1), 5, 5, 4, 'Fieldwork and volunteering gave me real-world conservation experience.'),
  ((SELECT id FROM users WHERE email='isabella.costa@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Asian Studies' AND u.name='National University of Singapore' LIMIT 1), 5, 5, 3, 'Wide-ranging topics and inspiring faculty.'),
  ((SELECT id FROM users WHERE email='noah.williams@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Computer Science Fundamentals' AND u.name='University of Tokyo' LIMIT 1), 5, 5, 4, 'Great coding practice and industry guest lectures.'),
  ((SELECT id FROM users WHERE email='zara.ahmed@fake.edu'), (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id WHERE c.subject_name='Latin American History' AND u.name='Pontifical Catholic University of Chile' LIMIT 1), 4, 4, 3, 'Engaging professors and great archival materials.')
ON CONFLICT DO NOTHING;

-- 5) Create one blog post per profile
INSERT INTO posts (profile_id, title, body)
VALUES
  ((SELECT id FROM profiles WHERE name='Emma Rodriguez'), 'Gaudí Field Trip Highlights', 'Spent a day exploring Gaudí''s masterpieces — Sagrada Família and Park Güell were stunning. Tips: buy timed tickets early and bring comfortable shoes.'),
  ((SELECT id FROM profiles WHERE name='Marcus Chen'), 'NUS Hackathon Experience', 'Participated in a weekend hackathon — met incredible students and mentors. Focus on planning your MVP and demo slides.'),
  ((SELECT id FROM profiles WHERE name='Sophie Müller'), 'Best Beach Study Spots in Sydney', 'Found great quiet spots near Bondi to study after morning labs; cafes nearby are student-friendly.'),
  ((SELECT id FROM profiles WHERE name='James O''Connor'), 'Navigating Tokyo Transport', 'Tokyo trains are efficient but crowded. Get a Suica card and plan routes with Hyperdia. Sundays are best for wandering neighborhoods.'),
  ((SELECT id FROM profiles WHERE name='Aisha Patel'), 'Community Project in Valparaíso', 'Worked with a local NGO on coastal sustainability. Cultural exchange was the most rewarding part.'),
  ((SELECT id FROM profiles WHERE name='Liam Thompson'), 'Startup Weekends in Barcelona', 'Attended meetups for entrepreneurs — great way to network and practice Spanish startup vocabulary.'),
  ((SELECT id FROM profiles WHERE name='Yuki Tanaka'), 'Volunteering with Conservation Groups', 'Joined beach cleanups and learned about local species. Hands-on fieldwork was invaluable.'),
  ((SELECT id FROM profiles WHERE name='Isabella Costa'), 'AI Labs at NUS: What to Expect', 'Rigorous lab assignments but excellent resources. Connect with TAs early and form study groups.'),
  ((SELECT id FROM profiles WHERE name='Noah Williams'), 'Visiting Animation Studios in Tokyo', 'Organized visits to production studios — valuable industry insights and networking.'),
  ((SELECT id FROM profiles WHERE name='Zara Ahmed'), 'Language Immersion Tips for Santiago', 'Live with a local family if possible and practice Spanish daily — my fluency improved quickly.');

-- 6) Add a sample image for each post (placeholder URLs under /uploads)
INSERT INTO post_images (post_id, url)
SELECT p.id, '/uploads/sample-placeholder.jpg' FROM posts p JOIN profiles pr ON pr.id = p.profile_id WHERE pr.name IN (
  'Emma Rodriguez','Marcus Chen','Sophie Müller','James O''Connor','Aisha Patel','Liam Thompson','Yuki Tanaka','Isabella Costa','Noah Williams','Zara Ahmed'
);

-- 7) Verification: counts and a couple sample rows
SELECT COUNT(*) as users_total FROM users WHERE email LIKE '%@fake.edu';
SELECT COUNT(*) as uni_reviews_total FROM university_reviews WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@fake.edu');
SELECT COUNT(*) as course_reviews_total FROM course_reviews WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@fake.edu');
SELECT COUNT(*) as posts_total FROM posts WHERE profile_id IN (SELECT id FROM profiles WHERE name IN ('Emma Rodriguez','Marcus Chen','Sophie Müller','James O''Connor','Aisha Patel','Liam Thompson','Yuki Tanaka','Isabella Costa','Noah Williams','Zara Ahmed'));

-- Show a sample of reviews
SELECT ur.id, u.first_name, u.last_name, uni.name as university, ur.rating, ur.review_text
FROM university_reviews ur JOIN users u ON u.id = ur.user_id JOIN universities uni ON uni.id = ur.university_id
WHERE u.email LIKE '%@fake.edu' ORDER BY ur.id LIMIT 5;

SELECT cr.id, u.first_name, u.last_name, c.subject_name, cr.rating, cr.enjoyability, cr.difficulty, cr.review_text
FROM course_reviews cr JOIN users u ON u.id = cr.user_id JOIN courses c ON c.id = cr.course_id
WHERE u.email LIKE '%@fake.edu' ORDER BY cr.id LIMIT 5;

SELECT p.id, pr.name as author, p.title
FROM posts p JOIN profiles pr ON pr.id = p.profile_id
WHERE pr.name IN ('Emma Rodriguez','Marcus Chen','Sophie Müller','James O''Connor','Aisha Patel','Liam Thompson','Yuki Tanaka','Isabella Costa','Noah Williams','Zara Ahmed')
ORDER BY p.id LIMIT 10;
