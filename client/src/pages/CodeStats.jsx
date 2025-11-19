import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLink } from "../api";

export default function CodeStats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getLink(code)
      .then(setLink)
      .catch((e) => setErr("Not found"));
  }, [code]);

  if (err) return <div className="text-red-600">{err}</div>;
  if (!link) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Stats for {link.code}</h2>
      <p>
        <strong>Target:</strong>{" "}
        <a
          href={link.url}
          className="text-sky-600"
          target="_blank"
          rel="noreferrer"
        >
          {link.url}
        </a>
      </p>
      <p>
        <strong>Clicks:</strong> {link.clicks}
      </p>
      <p>
        <strong>Last clicked:</strong>{" "}
        {link.lastClicked
          ? new Date(link.lastClicked).toLocaleString()
          : "Never"}
      </p>
      <p>
        <strong>Created at:</strong> {new Date(link.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
