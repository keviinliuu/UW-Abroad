import { useEffect, useState } from "react";
import { api } from "../api";

type Profile = {
  id: number;
  name: string;
  university: string;
  city?: string;
  term: string;
  budget?: number;
  rating?: number;
};

export default function ProfilesList({
  onOpenProfile,
}: {
  onOpenProfile: (id: number) => void;
}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [q, setQ] = useState({ university: "", city: "", term: "" });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (q.university) qs.set("university", q.university);
      if (q.city) qs.set("city", q.city);
      if (q.term) qs.set("term", q.term);
      const r = await api<{ rows: Profile[] }>(`/profiles?${qs.toString()}`);
      setProfiles(r.rows);
    } catch (err) {
      console.error(err);
      alert("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-medium">Browse profiles</h2>
        <div className="text-sm text-slate-500">{profiles.length} results</div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4"
      >
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="university"
          value={q.university}
          onChange={(e) => setQ({ ...q, university: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="city"
          value={q.city}
          onChange={(e) => setQ({ ...q, city: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="term"
          value={q.term}
          onChange={(e) => setQ({ ...q, term: e.target.value })}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid gap-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white border rounded shadow-sm flex items-start justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 mb-1">{p.name}</div>
                <div className="text-sm text-slate-600">
                  {p.university} · {p.city ?? "—"} · {p.term}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <button
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                  onClick={() => onOpenProfile(p.id)}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
