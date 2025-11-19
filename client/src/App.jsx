import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CodeStats from "./pages/CodeStats";

export default function App() {
  return (
    <div>
      <header className="mb-6">
        <div className="container flex items-center justify-between">
          <div>
            <Link to="/" className="header-link text-2xl font-extrabold">
              TinyLink
            </Link>
            <div className="text-sm text-gray-500">Shorten. Share. Track.</div>
          </div>

          <nav>
            <Link to="/" className="text-sm header-link">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<CodeStats />} />
        </Routes>
      </main>
    </div>
  );
}
