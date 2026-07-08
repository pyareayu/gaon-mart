const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("gaonmart_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { method: "GET", ...opts }),
  post: (path, body, opts) => request(path, { method: "POST", body, ...opts }),
  put: (path, body, opts) => request(path, { method: "PUT", body, ...opts }),
  del: (path, opts) => request(path, { method: "DELETE", ...opts }),
};
