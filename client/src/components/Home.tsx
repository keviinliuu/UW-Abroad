import logoUrl from "../assets/logo.png";

export default function Home({
  onNavigate,
}: {
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img
              src={logoUrl}
              alt="UW Abroad Logo"
              className="h-16 md:h-20 w-auto drop-shadow-sm"
              loading="eager"
              decoding="async"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Study Abroad Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover universities, read reviews from real students, and connect
            with the UW Abroad community
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => onNavigate("search")}
              className="px-8 py-4 bg-sky-600 text-white rounded-lg text-lg font-semibold hover:bg-sky-700 shadow-lg hover:shadow-xl transition-all"
            >
              Explore Exchange
            </button>
            <button
              onClick={() => onNavigate("list")}
              className="px-8 py-4 bg-white text-sky-600 border-2 border-sky-600 rounded-lg text-lg font-semibold hover:bg-sky-50 shadow-lg hover:shadow-xl transition-all"
            >
              Browse Student Profiles
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything You Need to Plan Your Study Abroad
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Discover Universities
            </h3>
            <p className="text-gray-600 mb-4">
              Search through partner universities around the world. View
              courses, read reviews, and find the perfect fit for your academic
              goals.
            </p>
            <button
              onClick={() => onNavigate("search")}
              className="text-sky-600 font-medium hover:text-sky-700"
            >
              Start Exploring →
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Connect with Students
            </h3>
            <p className="text-gray-600 mb-4">
              Read real stories from UW students who studied abroad. Learn from
              their experiences, tips, and advice about life overseas.
            </p>
            <button
              onClick={() => onNavigate("list")}
              className="text-sky-600 font-medium hover:text-sky-700"
            >
              Browse Profiles →
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Read Honest Reviews
            </h3>
            <p className="text-gray-600 mb-4">
              Get the inside scoop on universities and courses. See ratings for
              academics, enjoyability, and difficulty from students who've been
              there.
            </p>
            <button
              onClick={() => onNavigate("search")}
              className="text-sky-600 font-medium hover:text-sky-700"
            >
              View Reviews →
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sky-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Share Your Experience?
          </h2>
          <p className="text-xl text-sky-100 mb-8">
            Create your profile and help future students make informed decisions
            about studying abroad.
          </p>
          <button
            onClick={() => onNavigate("signup")}
            className="px-8 py-4 bg-white text-sky-600 rounded-lg text-lg font-semibold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">6+</div>
            <div className="text-gray-600 font-medium">
              Partner Universities
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">18+</div>
            <div className="text-gray-600 font-medium">Courses Available</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">10+</div>
            <div className="text-gray-600 font-medium">Student Profiles</div>
          </div>
        </div>
      </div>
    </div>
  );
}
