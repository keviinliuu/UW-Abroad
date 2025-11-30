import { useRef, useState } from "react";
import { api, apiForm } from "../api";

type Props = {
  profileId: number;
  onCreated?: () => void;
};

export default function CreatePost({ profileId, onCreated }: Props) {
  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api<{ id: number }>(
        `/profiles/${profileId}/posts`,
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );
      if (files.length) {
        const fd = new FormData();
        for (const f of files) fd.append("images", f);
        try {
          await apiForm<{ images: any[] }>(`/posts/${created.id}/images`, fd, {
            method: "POST",
          });
        } catch (e) {
          console.error(e);
          alert("Post created, but image upload failed.");
        }
      }
      setForm({ title: "", body: "" });
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onCreated && onCreated();
    } catch (err) {
      console.error(err);
      alert("Create post failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 p-4 bg-sky-50 border border-sky-200 rounded-lg mb-4"
    >
      <h4 className="font-medium text-gray-700">Add a new post</h4>
      <input
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Post title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="w-full border border-gray-300 px-3 py-2 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Share your thoughts, tips, or experiences..."
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attach photos (optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-sky-600 file:text-white hover:file:bg-sky-700"
        />
        {files.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
          </div>
        )}
      </div>
      <div>
        <button
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          disabled={loading}
          type="submit"
        >
          {loading ? "Posting..." : "Add Post"}
        </button>
      </div>
    </form>
  );
}
