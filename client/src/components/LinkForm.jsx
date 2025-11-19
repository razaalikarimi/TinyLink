import React, { useState } from "react";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
const URL_REGEX = /^https?:\/\//i;

export default function LinkForm({ onCreate }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function validate() {
    if (!url.trim()) return "Please enter a URL";
    let candidate = url.trim();
    if (!URL_REGEX.test(candidate)) candidate = "https://" + candidate;
    try {
      new URL(candidate);
    } catch {
      return "Invalid URL";
    }
    if (code.trim() && !CODE_REGEX.test(code.trim()))
      return "Custom code must be 6–8 letters/numbers";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const err = validate();
    if (err) {
      setMsg({ ok: false, text: err });
      return;
    }
    setLoading(true);
    try {
      let normalized = url.trim();
      if (!URL_REGEX.test(normalized)) normalized = "https://" + normalized;
      const payload = { url: normalized };
      if (code.trim()) payload.code = code.trim();
      const res = await onCreate(payload);
      setMsg({ ok: true, text: `Created: ${res.code}` });
      setUrl("");
      setCode("");
    } catch (e) {
      setMsg({ ok: false, text: e.message || "Server error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card form-card">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Target URL</label>
          <input
            className="input mt-1"
            placeholder="https://example.com/long/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Custom code (optional)
          </label>
          <input
            className="input mt-1"
            placeholder="6-8 chars (A-Za-z0-9)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="text-xs text-gray-500 mt-1">
            Leave empty to auto-generate. Only 6–8 letters/numbers.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="btn btn-primary small"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setCode("");
              setMsg(null);
            }}
            className="btn btn-ghost small"
          >
            Reset
          </button>
          {msg && (
            <div
              className={`text-sm ${
                msg.ok ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {msg.text}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
