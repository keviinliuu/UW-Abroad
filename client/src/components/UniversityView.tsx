import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

type University = {
  id: number;
  name: string;
  city?: string;
  country?: string;
  description?: string;
};

type Review = {
  id: number;
  user_id: number;
  rating: number;
  review_text?: string;
  created_at: string;
  first_name: string;
  last_name: string;
};

type Course = {
  id: number;
  subject_name: string;
  course_code?: string;
  description?: string;
};

export default function UniversityView({
  id,
  onBack,
  onViewCourse,
}: {
  id: number;
  onBack: () => void;
  onViewCourse: (id: number) => void;
}) {
  const { user } = useAuth();
  const [university, setUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, review_text: "" });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const result = await api<{
        university: University;
        reviews: Review[];
        courses: Course[];
        averageRating: number | null;
      }>(`/universities/${id}`);
      setUniversity(result.university);
      setReviews(result.reviews || []);
      setCourses(result.courses || []);
      setAverageRating(result.averageRating);
    } catch (err) {
      console.error(err);
      alert("Failed to load university");
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api(`/universities/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify(newReview),
      });
      setNewReview({ rating: 5, review_text: "" });
      setShowReviewForm(false);
      load(); // Reload to show new review
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!university)
    return <p className="text-center py-8">University not found</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 mb-4"
      >
        ← Back
      </button>

      {/* University Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{university.name}</h1>
        {(university.city || university.country) && (
          <p className="text-lg text-gray-600 mt-2">
            {university.city &&
              university.country &&
              `${university.city}, ${university.country}`}
            {university.city && !university.country && university.city}
            {!university.city && university.country && university.country}
          </p>
        )}
        {university.description && (
          <p className="text-gray-700 mt-4">{university.description}</p>
        )}
        {averageRating !== null && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-bold text-sky-600">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">/ 5.0</span>
            <span className="text-sm text-gray-500">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Courses ({courses.length})
        </h2>
        {courses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No courses listed yet
          </p>
        ) : (
          <ul className="space-y-2">
            {courses.map((course) => (
              <li
                key={course.id}
                onClick={() => onViewCourse(course.id)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="font-medium text-gray-800">
                  {course.subject_name}
                  {course.course_code && ` (${course.course_code})`}
                </div>
                {course.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {course.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={submitReview}
            className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg"
          >
            <h3 className="font-medium text-gray-700 mb-3">Your Review</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review (optional)
              </label>
              <textarea
                value={newReview.review_text}
                onChange={(e) =>
                  setNewReview({ ...newReview, review_text: e.target.value })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview({ rating: 5, review_text: "" });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      {review.first_name} {review.last_name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-semibold text-sky-600">
                        {review.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">/ 5.0</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-gray-700 mt-2">{review.review_text}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
