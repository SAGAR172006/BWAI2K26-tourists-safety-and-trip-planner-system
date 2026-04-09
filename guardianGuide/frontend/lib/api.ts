const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  return fetch(`${API_URL}${path}`, { ...options, headers });
}
