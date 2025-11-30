import { useState, useEffect } from "react";
import { api } from "../api";

interface Profile {
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
}

export default function EditProfile({
  onUpdated,
  onCancel,
}: {
  onUpdated: (id: number) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<any>({ name: "", university: "", term: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api<Profile>("/profiles/me");
        setForm(profile);
      } catch (err) {
        console.error("Failed to load profile:", err);
        alert("Failed to load your profile");
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api<Profile>("/profiles/me", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      onUpdated(r.id);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <div className="text-center py-8">Loading your profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University
          </label>
          <input
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="University of Washington"
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Barcelona"
              value={form.city || ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Spain"
              value={form.country || ""}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Spring 2025"
              value={form.term}
              onChange={(e) => setForm({ ...form, term: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="5000"
              type="number"
              value={form.budget || ""}
              onChange={(e) =>
                setForm({ ...form, budget: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <input
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Spanish, English"
            value={form.language || ""}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Share your experience studying abroad..."
            value={form.summary || ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
            type="submit"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
