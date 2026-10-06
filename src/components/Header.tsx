"use client";

import { useState } from "react";
import { usePlayerName } from "@/hooks/usePlayerName";

const links = [
  { href: "/#courses", label: "コース" },
  { href: "/#games", label: "ゲーム一覧" },
  { href: "/parent", label: "保護者の方へ" },
  { href: "/teachers", label: "英語の先生へ" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { playerName, setPlayerName } = usePlayerName();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => {
    setDraft(playerName);
    setEditing(true);
  };

  const saveEdit = () => {
    setPlayerName(draft);
    setEditing(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">WISE English Club</p>
              <p className="text-xs text-gray-500 leading-tight">学習ホーム</p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            {editing ? (
              <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="なまえ"
                  autoFocus
                  className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-400"
                />
                <button type="submit" className="text-xs px-2.5 py-1.5 bg-indigo-500 text-white rounded-lg font-bold">OK</button>
                <button type="button" onClick={() => setEditing(false)} className="text-xs text-gray-400">✕</button>
              </form>
            ) : (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
              >
                {playerName ? (
                  <><span>👤</span><span>{playerName}</span></>
                ) : (
                  <><span>✏️</span><span>なまえを入れる</span></>
                )}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {!editing && (
              <button
                onClick={startEdit}
                className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
              >
                {playerName ? `👤 ${playerName}` : "✏️ なまえ"}
              </button>
            )}
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {editing && (
          <div className="md:hidden pb-3">
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="なまえ"
                autoFocus
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-400"
              />
              <button type="submit" className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-bold">OK</button>
              <button type="button" onClick={() => setEditing(false)} className="text-gray-400 px-2">✕</button>
            </form>
          </div>
        )}

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-3 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
