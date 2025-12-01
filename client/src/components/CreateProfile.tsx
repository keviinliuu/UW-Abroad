import { useState, useEffect } from "react";
import { api } from "../api";

type University = {
  id: number;
  name: string;
  city?: string;
  country?: string;
};

export default function CreateProfile({
  onCreated,
}: {
  onCreated: (id: number) => void;
}) {
  const [form, setForm] = useState<any>({ name: "", university: "", term: "" });
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const result = await api<{ count: number; universities: University[] }>(
          "/universities?limit=100"
        );
        setUniversities(result.universities || []);
      } catch (err) {
        console.error("Failed to fetch universities:", err);
        alert("Failed to load universities");
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = Number(e.target.value);
    const selectedUni = universities.find((u) => u.id === universityId);

    if (selectedUni) {
      setForm({
        ...form,
        university: selectedUni.name,
        city: selectedUni.city || "",
        country: selectedUni.country || "",
      });
    } else {
      setForm({ ...form, university: "", city: "", country: "" });
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api<any>("/profiles", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onCreated(r.id);
    } catch (err) {
      console.error(err);
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create Profile</h2>
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
            University *
          </label>
          {loadingUniversities ? (
            <div className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-500">
              Loading universities...
            </div>
          ) : (
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={
                universities.find((u) => u.name === form.university)?.id || ""
              }
              onChange={handleUniversityChange}
              required
            >
              <option value="">Select a university</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                  {uni.city && uni.country && ` - ${uni.city}, ${uni.country}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Auto-filled from university"
              value={form.city || ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Auto-filled from university"
              value={form.country || ""}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              readOnly
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
            {loading ? "Creating..." : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
