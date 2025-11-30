const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export async function api<T>(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${text}`)
  }
  return (await res.json()) as T
}

// Submit multipart form data (e.g., image uploads). Do not set Content-Type so the browser sets proper boundaries.
export async function apiForm<T>(path: string, form: FormData, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || 'POST',
    body: form,
    headers,
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

export default API_BASE
