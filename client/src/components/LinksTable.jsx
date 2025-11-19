import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

export default function LinksTable({ links, onDelete }) {
  const [copied, setCopied] = useState(null);

  async function copyToClipboard(text, code) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      alert("Copy failed");
    }
  }

  if (!links || links.length === 0) {
    return (
      <div className="card p-6 text-center text-purple-700 font-semibold">
        No links yet — create one ✨
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-md">
      {links.map((l) => (
        <div
          key={l.code}
          className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <RouterLink
                to={`/code/${l.code}`}
                className="text-lg font-bold text-purple-700 hover:underline"
              >
                {l.code}
              </RouterLink>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {l.clicks} clicks
              </span>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {l.lastClicked
                  ? new Date(l.lastClicked).toLocaleString()
                  : "Never clicked"}
              </span>
            </div>

            <div className="mt-2 text-sm text-slate-700">
              <div className="text-xs text-gray-500">Short URL</div>
              <a
                href={`${window.location.origin}/${l.code}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {window.location.origin}/{l.code}
              </a>

              <div className="mt-2 text-xs text-gray-500">Target</div>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline break-all"
              >
                {l.url}
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() =>
                copyToClipboard(`${window.location.origin}/${l.code}`, l.code)
              }
              className="btn btn-primary small"
            >
              {copied === l.code ? "Copied ✓" : "Copy"}
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${l.code}?`)) onDelete(l.code);
              }}
              className="btn btn-ghost small"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
