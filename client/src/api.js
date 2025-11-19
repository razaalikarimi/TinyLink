const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function handleRes(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || "Server error");
    err.status = res.status;
    throw err;
  }
  return res.json().catch(() => ({}));
}

export async function fetchLinks() {
  const res = await fetch(`${BASE}/api/links`);
  return handleRes(res);
}

export async function createLink(payload) {
  const res = await fetch(`${BASE}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function deleteLink(code) {
  const res = await fetch(`${BASE}/api/links/${code}`, { method: "DELETE" });
  return handleRes(res);
}

export async function getLink(code) {
  const res = await fetch(`${BASE}/api/links/${code}`);
  return handleRes(res);
}
