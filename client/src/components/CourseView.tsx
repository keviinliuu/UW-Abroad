import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

type Course = {
  id: number;
  university_id: number;
  subject_name: string;
  course_code?: string;
  description?: string;
  university_name: string;
  city?: string;
  country?: string;
};

type Review = {
  id: number;
  user_id: number;
  rating: number;
  enjoyability: number;
  difficulty: number;
  review_text?: string;
  created_at: string;
  first_name: string;
  last_name: string;
};

type Averages = {
  rating: number | null;
  enjoyability: number | null;
  difficulty: number | null;
};

export default function CourseView({
  id,
  onBack,
  onViewUniversity,
  onRequestLogin,
}: {
  id: number;
  onBack: () => void;
  onViewUniversity: (id: number) => void;
  onRequestLogin?: () => void;
}) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averages, setAverages] = useState<Averages>({
    rating: null,
    enjoyability: null,
    difficulty: null,
  });
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    enjoyability: 5,
    difficulty: 3,
    review_text: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const result = await api<{
        course: Course;
        reviews: Review[];
        averages: Averages;
      }>(`/courses/${id}`);
      setCourse(result.course);
      setReviews(result.reviews || []);
      setAverages(result.averages);
    } catch (err) {
      console.error(err);
      alert("Failed to load course");
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api(`/courses/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify(newReview),
      });
      setNewReview({
        rating: 5,
        enjoyability: 5,
        difficulty: 3,
        review_text: "",
      });
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
  if (!course) return <p className="text-center py-8">Course not found</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 mb-4"
      >
        ← Back
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {course.subject_name}
          {course.course_code && (
            <span className="text-gray-600 ml-2">({course.course_code})</span>
          )}
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          at{" "}
          <button
            onClick={() => onViewUniversity(course.university_id)}
            className="text-sky-600 hover:underline"
          >
            {course.university_name}
          </button>
          {(course.city || course.country) && (
            <span className="text-gray-500 ml-2">
              {course.city &&
                course.country &&
                `• ${course.city}, ${course.country}`}
              {course.city && !course.country && `• ${course.city}`}
              {!course.city && course.country && `• ${course.country}`}
            </span>
          )}
        </p>
        {course.description && (
          <p className="text-gray-700 mt-4">{course.description}</p>
        )}

        {/* Average Scores */}
        {reviews.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-sky-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Overall Rating</div>
              <div className="text-2xl font-bold text-sky-600">
                {averages.rating?.toFixed(1) || "N/A"}
              </div>
              <div className="text-xs text-gray-500">/ 5.0</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Enjoyability</div>
              <div className="text-2xl font-bold text-green-600">
                {averages.enjoyability?.toFixed(1) || "N/A"}
              </div>
              <div className="text-xs text-gray-500">/ 5.0</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Difficulty</div>
              <div className="text-2xl font-bold text-orange-600">
                {averages.difficulty?.toFixed(1) || "N/A"}
              </div>
              <div className="text-xs text-gray-500">/ 5.0</div>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Reviews ({reviews.length})
          </h2>
          {user ? (
            !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Write a Review
              </button>
            )
          ) : (
            <button
              onClick={onRequestLogin}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Login to Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={submitReview}
            className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg space-y-3"
          >
            <h3 className="font-medium text-gray-700">Your Review</h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overall Rating *
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enjoyability *
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={newReview.enjoyability}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      enjoyability: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={newReview.difficulty}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      difficulty: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review (optional)
              </label>
              <textarea
                value={newReview.review_text}
                onChange={(e) =>
                  setNewReview({ ...newReview, review_text: e.target.value })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Share your experience with this course..."
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
                  setNewReview({
                    rating: 5,
                    enjoyability: 5,
                    difficulty: 3,
                    review_text: "",
                  });
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
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-800">
                      {review.first_name} {review.last_name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Rating:</span>{" "}
                    <span className="font-semibold text-sky-600">
                      {Number(review.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Enjoyability:</span>{" "}
                    <span className="font-semibold text-green-600">
                      {Number(review.enjoyability).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Difficulty:</span>{" "}
                    <span className="font-semibold text-orange-600">
                      {Number(review.difficulty).toFixed(1)}
                    </span>
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
