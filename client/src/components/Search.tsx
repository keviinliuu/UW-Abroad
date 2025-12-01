import { useState, useEffect } from "react";
import { api } from "../api";

type Tab = "profiles" | "universities" | "courses";

type Profile = {
  id: number;
  name: string;
  university: string;
  city?: string;
  country?: string;
  term: string;
};

type University = {
  id: number;
  name: string;
  city?: string;
  country?: string;
  description?: string;
};

type Course = {
  id: number;
  subject_name: string;
  course_code?: string;
  description?: string;
};

export default function Search({
  onViewProfile,
  onViewUniversity,
  onViewCourse,
}: {
  onViewProfile: (id: number) => void;
  onViewUniversity: (id: number) => void;
  onViewCourse: (id: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("profiles");
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchProfiles() {
    setLoading(true);
    try {
      const result = await api<{ count: number; rows: Profile[] }>(
        `/profiles?search=${encodeURIComponent(searchQuery)}&limit=20`
      );
      setProfiles(result.rows || []);
    } catch (err) {
      console.error(err);
      alert("Failed to search profiles");
    } finally {
      setLoading(false);
    }
  }

  async function searchUniversities() {
    setLoading(true);
    try {
      const result = await api<{ count: number; universities: University[] }>(
        `/universities?search=${encodeURIComponent(searchQuery)}&limit=20`
      );
      setUniversities(result.universities || []);
    } catch (err) {
      console.error(err);
      alert("Failed to search universities");
    } finally {
      setLoading(false);
    }
  }

  async function searchCourses() {
    setLoading(true);
    try {
      const result = await api<{ count: number; courses: Course[] }>(
        `/courses?search=${encodeURIComponent(searchQuery)}&limit=20`
      );
      setCourses(result.courses || []);
    } catch (err) {
      console.error(err);
      alert("Failed to search courses");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (activeTab === "profiles") {
      searchProfiles();
    } else if (activeTab === "universities") {
      searchUniversities();
    } else if (activeTab === "courses") {
      searchCourses();
    }
  }

  // Auto-search when searchQuery or activeTab changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeTab === "profiles") {
        searchProfiles();
      } else if (activeTab === "universities") {
        searchUniversities();
      } else if (activeTab === "courses") {
        searchCourses();
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Search</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profiles")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "profiles"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Profiles
        </button>
        <button
          onClick={() => setActiveTab("universities")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "universities"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Universities
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "courses"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Courses
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </form>

      {/* Results */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === "profiles" && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Profile Results ({profiles.length})
            </h3>
            {profiles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No profiles found. Try searching!
              </p>
            ) : (
              <ul className="space-y-3">
                {profiles.map((profile) => (
                  <li
                    key={profile.id}
                    onClick={() => onViewProfile(profile.id)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold text-gray-800">
                      {profile.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {profile.university} • {profile.term}
                      {profile.city && ` • ${profile.city}`}
                      {profile.country && `, ${profile.country}`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "universities" && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              University Results ({universities.length})
            </h3>
            {universities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No universities found. Try searching!
              </p>
            ) : (
              <ul className="space-y-3">
                {universities.map((uni) => (
                  <li
                    key={uni.id}
                    onClick={() => onViewUniversity(uni.id)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold text-gray-800">
                      {uni.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {uni.city && uni.country && `${uni.city}, ${uni.country}`}
                      {uni.city && !uni.country && uni.city}
                      {!uni.city && uni.country && uni.country}
                    </div>
                    {uni.description && (
                      <div className="text-sm text-gray-500 mt-2">
                        {uni.description}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Course Results ({courses.length})
            </h3>
            {courses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No courses found. Try searching!
              </p>
            ) : (
              <ul className="space-y-3">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    onClick={() => onViewCourse(course.id)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="font-semibold text-gray-800">
                      {course.subject_name}
                      {course.course_code && ` (${course.course_code})`}
                    </div>
                    {course.description && (
                      <div className="text-sm text-gray-500 mt-2">
                        {course.description}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
