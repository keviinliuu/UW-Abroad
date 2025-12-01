-- Add reviews for Technical University of Denmark from existing fake students

-- University reviews for DTU
INSERT INTO university_reviews (user_id, university_id, rating, review_text)
VALUES
  ((SELECT id FROM users WHERE email='marcus.chen@fake.edu'), 
   (SELECT id FROM universities WHERE name='Technical University of Denmark'), 
   5, 
   'Incredible engineering programs and cutting-edge facilities. The campus is beautiful and Copenhagen is bike-friendly!'),
  ((SELECT id FROM users WHERE email='sophie.muller@fake.edu'), 
   (SELECT id FROM universities WHERE name='Technical University of Denmark'), 
   5, 
   'World-class renewable energy research. Professors are accessible and the Nordic lifestyle is amazing.'),
  ((SELECT id FROM users WHERE email='noah.williams@fake.edu'), 
   (SELECT id FROM universities WHERE name='Technical University of Denmark'), 
   4, 
   'Great tech programs and innovation culture. High cost of living but quality of life is excellent.')
ON CONFLICT DO NOTHING;

-- Course reviews for DTU courses
-- Renewable Energy Systems
INSERT INTO course_reviews (user_id, course_id, rating, enjoyability, difficulty, review_text)
VALUES
  ((SELECT id FROM users WHERE email='sophie.muller@fake.edu'), 
   (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id 
    WHERE c.subject_name='Renewable Energy Systems' AND u.name='Technical University of Denmark' LIMIT 1), 
   5, 5, 4, 
   'Hands-on projects with wind turbines and solar panels. Field trips to offshore wind farms were unforgettable!')
ON CONFLICT DO NOTHING;

-- Data Science and Machine Learning
INSERT INTO course_reviews (user_id, course_id, rating, enjoyability, difficulty, review_text)
VALUES
  ((SELECT id FROM users WHERE email='marcus.chen@fake.edu'), 
   (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id 
    WHERE c.subject_name='Data Science and Machine Learning' AND u.name='Technical University of Denmark' LIMIT 1), 
   5, 5, 5, 
   'Challenging but rewarding. Real-world datasets and industry partnerships made this course exceptional.')
ON CONFLICT DO NOTHING;

-- Sustainable Architecture
INSERT INTO course_reviews (user_id, course_id, rating, enjoyability, difficulty, review_text)
VALUES
  ((SELECT id FROM users WHERE email='noah.williams@fake.edu'), 
   (SELECT c.id FROM courses c JOIN universities u ON u.id=c.university_id 
    WHERE c.subject_name='Sustainable Architecture' AND u.name='Technical University of Denmark' LIMIT 1), 
   4, 5, 3, 
   'Inspiring course on green building design. Loved the studio projects and visits to sustainable housing developments.')
ON CONFLICT DO NOTHING;

-- Verification
SELECT COUNT(*) as dtu_university_reviews 
FROM university_reviews ur 
JOIN universities u ON u.id = ur.university_id 
WHERE u.name = 'Technical University of Denmark';

SELECT COUNT(*) as dtu_course_reviews 
FROM course_reviews cr 
JOIN courses c ON c.id = cr.course_id 
JOIN universities u ON u.id = c.university_id 
WHERE u.name = 'Technical University of Denmark';

SELECT c.subject_name, cr.rating, cr.enjoyability, cr.difficulty, u.first_name, u.last_name
FROM course_reviews cr 
JOIN courses c ON c.id = cr.course_id 
JOIN universities uni ON uni.id = c.university_id
JOIN users u ON u.id = cr.user_id
WHERE uni.name = 'Technical University of Denmark';
