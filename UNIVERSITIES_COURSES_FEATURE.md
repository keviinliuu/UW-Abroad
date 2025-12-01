# Universities & Courses Review System

## Overview

This feature adds a comprehensive system for searching, viewing, and reviewing universities and courses. Users can:

- **Search** for profiles, universities, and courses with a tabbed interface
- **View university pages** with reviews, ratings, and available courses
- **View course pages** with detailed metrics (rating, enjoyability, difficulty) and reviews
- **Submit reviews** for universities and courses with structured ratings

## Database Schema

### New Tables

#### `universities`

- `id` - Primary key
- `name` - University name
- `city` - City location
- `country` - Country location
- `description` - Description text
- Unique constraint on (name, city, country)

#### `courses`

- `id` - Primary key
- `subject_name` - Course/subject name
- `course_code` - Optional course code
- `description` - Course description
- Unique constraint on (subject_name, course_code)

#### `university_courses`

- Links courses to universities (many-to-many relationship)
- `university_id` - References universities
- `course_id` - References courses

#### `university_reviews`

- `id` - Primary key
- `user_id` - References users (author)
- `university_id` - References universities
- `rating` - 1-5 rating
- `review_text` - Optional text review

#### `course_reviews`

- `id` - Primary key
- `user_id` - References users (author)
- `course_id` - References courses
- `university_id` - Where the course was taken
- `rating` - Overall 1-5 rating
- `enjoyability` - 1-5 enjoyability rating
- `difficulty` - 1-5 difficulty rating
- `review_text` - Optional text review

## Backend API Endpoints

### Universities

- `GET /universities` - List/search universities

  - Query params: `search`, `country`, `limit`, `offset`
  - Returns: `{ count, universities }`

- `GET /universities/:id` - Get single university with reviews and courses

  - Returns: `{ university, reviews, courses, averageRating }`

- `POST /universities` - Create university (authenticated)

  - Body: `{ name, city?, country?, description? }`

- `POST /universities/:id/reviews` - Create university review (authenticated)
  - Body: `{ rating, review_text? }`

### Courses

- `GET /courses` - List/search courses

  - Query params: `search`, `university_id`, `limit`, `offset`
  - Returns: `{ count, courses }`

- `GET /courses/:id` - Get single course with reviews and stats

  - Returns: `{ course, reviews, universities, averages: { rating, enjoyability, difficulty } }`

- `POST /courses` - Create course (authenticated)

  - Body: `{ subject_name, course_code?, description? }`

- `POST /courses/:id/reviews` - Create course review (authenticated)

  - Body: `{ university_id, rating, enjoyability, difficulty, review_text? }`

- `POST /universities/:universityId/courses/:courseId` - Link course to university (authenticated)

## Frontend Components

### `Search.tsx`

Tabbed search interface with three tabs:

- **Profiles** - Search existing study abroad profiles
- **Universities** - Search universities
- **Courses** - Search courses

### `UniversityView.tsx`

University detail page showing:

- University information
- Average rating from all reviews
- List of courses offered
- Review submission form (when logged in)
- List of all reviews with ratings

### `CourseView.tsx`

Course detail page showing:

- Course information
- Average scores (rating, enjoyability, difficulty)
- Universities offering the course
- Review submission form with:
  - University selector (where you took it)
  - Overall rating (1-5)
  - Enjoyability rating (1-5)
  - Difficulty rating (1-5)
  - Optional text review
- List of all reviews grouped by metrics

## Navigation Updates

The main navigation now includes:

- **Search** - Primary entry point for finding content
- **Browse Profiles** - Original profile browsing
- **My Profile** - User's own profile (if created)
- **Create Profile** - Profile creation (if none exists)

## Seed Data

Sample data has been loaded for:

- 5 universities (Barcelona, Santiago, Sydney, Singapore, Tokyo)
- 8 courses (Spanish, History, Business, Marine Bio, Asian Studies, CS, Art History, Environmental Science)
- 14 university-course relationships

## Usage Flow

1. **Browse/Search**

   - Click "Search" in navigation
   - Use tabs to switch between Profiles, Universities, and Courses
   - Enter search query and click Search
   - Click any result to view details

2. **View University**

   - See all university details and average rating
   - Browse courses offered at that university
   - Click "Write a Review" to add your rating
   - View all existing reviews

3. **View Course**

   - See course details and average scores
   - View which universities offer the course
   - Click "Write a Review" to add detailed ratings
   - Select which university you took it at
   - Rate overall, enjoyability, and difficulty
   - Add optional text review

4. **Submit Reviews**
   - Must be logged in
   - University reviews: 1-5 rating + optional text
   - Course reviews: university + 3 ratings (overall, enjoyability, difficulty) + optional text

## Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Create an account or login
4. Click "Search" to explore universities and courses
5. Click on any university or course to view details
6. Submit reviews to test the full flow

## Future Enhancements

Potential additions:

- University/course creation forms in the UI
- Image uploads for universities
- Tags/categories for courses
- Advanced filtering and sorting
- Review moderation
- User review history
- Upvote/helpful markers on reviews
