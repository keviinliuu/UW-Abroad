import { useEffect, useState } from "react";
import API_BASE, { api } from "../api";
import CreatePost from "./CreatePost";

type Profile = {
  id: number;
  name: string;
  university: string;
  city?: string;
  country?: string;
  term: string;
  budget?: number;
  currency?: string;
  language?: string;
  summary?: string;
  rating?: number;
};

type Post = {
  id: number;
  profile_id: number;
  title: string;
  body: string;
  created_at: string;
  images?: PostImage[];
};

type PostImage = {
  id: number;
  post_id: number;
  url: string;
  created_at: string;
};

export default function ProfileView({
  id,
  onBack,
  isOwnProfile = false,
  onEdit,
}: {
  id: number;
  onBack: () => void;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ profile: Profile; posts: Post[] }>(
        `/profiles/${id}`
      );
      setProfile(r.profile);
      setPosts(r.posts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto">
      <button
        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 mb-4"
        onClick={onBack}
      >
        ← Back
      </button>

      {loading && <p className="text-center py-8">Loading…</p>}

      {!loading && profile && (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.name}
                </h2>
                <div className="mt-2 space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{profile.university}</span>
                  </div>
                  <div className="text-sm">
                    {profile.city && profile.country && (
                      <span>
                        {profile.city}, {profile.country}
                      </span>
                    )}
                    {profile.city && !profile.country && (
                      <span>{profile.city}</span>
                    )}
                    {profile.term && (
                      <span className="ml-2">• {profile.term}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                {isOwnProfile && onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="px-4 py-2 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50 shadow-sm font-medium"
                  >
                    Edit Profile
                  </button>
                )}
                <div className="text-right">
                  {profile.budget && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Budget:</span>{" "}
                      {profile.budget} {profile.currency || "USD"}
                    </div>
                  )}
                  {profile.language && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Language:</span>{" "}
                      {profile.language}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {profile.summary && (
              <p className="mt-4 text-gray-700 leading-relaxed">
                {profile.summary}
              </p>
            )}
          </div>

          {/* Posts Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Posts</h3>
              <span className="text-sm text-gray-500">
                {posts.length} post{posts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {isOwnProfile && (
              <CreatePost profileId={profile.id} onCreated={load} />
            )}

            {posts.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No posts yet</p>
            ) : (
              <ul className="space-y-4 mt-4">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-semibold text-gray-800 mb-2">
                      {post.title}
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {post.body}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {post.images && post.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {post.images.map((img) => (
                          <img
                            key={img.id}
                            src={`${API_BASE}${img.url}`}
                            alt="Post attachment"
                            className="w-full h-40 object-cover rounded-md border border-gray-200"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
