import React, { useEffect, useState } from "react";
import { fetchLinks, createLink, deleteLink } from "../api";
import LinkForm from "../components/LinkForm";
import LinksTable from "../components/LinksTable";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (e) {
      setError("Could not load links");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    const result = await createLink(payload);
    // server returns created object (code, url, etc.) — prepend to list
    setLinks((prev) => [result, ...prev]);
    return result;
  }

  async function handleDelete(code) {
    if (!confirm(`Delete ${code}?`)) return;
    await deleteLink(code);
    setLinks((prev) => prev.filter((l) => l.code !== code));
  }

  return (
    <>
      <div className="mb-6">
        <LinkForm onCreate={handleCreate} />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <LinksTable links={links} onDelete={handleDelete} />
    </>
  );
}
