"use client";

import type { ReactNode } from "react";
import { speak } from "@/lib/eikenStats";

export function Shell({
  title,
  sub,
  backHref,
  progress,
  children,
}: {
  title: string;
  sub?: string;
  backHref: string;
  /** 0〜1 */
  progress?: number;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <a
            href={backHref}
            className="flex-shrink-0 rounded-lg px-2 py-1.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
          >
            ← コースへ
          </a>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 truncate">{title}</p>
            {sub && <p className="text-xs text-gray-500 truncate">{sub}</p>}
          </div>
        </div>
        {progress !== undefined && (
          <div className="h-1.5 bg-gray-100" aria-hidden>
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }}
            />
          </div>
        )}
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}

export function SpeakButton({ text, label = "音声をきく" }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label}
      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-indigo-50 text-xl text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100"
    >
      🔊
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-indigo-600 text-white px-5 py-3.5 text-base font-bold hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500"
    >
      {children}
    </button>
  );
}

export function OptionButton({
  children,
  state,
  onClick,
  disabled,
}: {
  children: ReactNode;
  /** idle=まだ / right=正解の選択肢 / wrong=えらんだ誤答 / dim=その他 */
  state: "idle" | "right" | "wrong" | "dim";
  onClick: () => void;
  disabled?: boolean;
}) {
  const cls = {
    idle: "border-gray-200 bg-white text-gray-900 hover:border-indigo-400 hover:bg-indigo-50",
    right: "border-emerald-500 bg-emerald-50 text-emerald-900",
    wrong: "border-rose-400 bg-rose-50 text-rose-900",
    dim: "border-gray-200 bg-white text-gray-400",
  }[state];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 text-lg font-bold transition-colors ${cls}`}
    >
      {state === "right" && <span aria-hidden>○ </span>}
      {state === "wrong" && <span aria-hidden>× </span>}
      {children}
    </button>
  );
}

export function Verdict({ ok }: { ok: boolean }) {
  return (
    <p className={`text-lg font-extrabold ${ok ? "text-emerald-700" : "text-rose-700"}`} role="status">
      {ok ? "せいかい！" : "ざんねん。こたえを見て、もういちど出るよ"}
    </p>
  );
}

export function ResultCard({
  title,
  score,
  total,
  children,
  onRetry,
  backHref,
}: {
  title: string;
  score: number;
  total: number;
  children?: ReactNode;
  onRetry: () => void;
  backHref: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border-2 border-indigo-200 p-6 text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-4xl font-extrabold text-gray-900">
          {score} <span className="text-xl text-gray-500">/ {total}</span>
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {score === total
            ? "ぜんぶ1回目でできました"
            : "まちがえたものは、つぎの回に先に出ます"}
        </p>
      </div>
      {children}
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={backHref}
          className="rounded-2xl bg-indigo-600 text-white px-5 py-3.5 text-center text-base font-bold hover:bg-indigo-700"
        >
          コースにもどる
        </a>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-2xl bg-white text-indigo-700 ring-1 ring-indigo-200 px-5 py-3.5 text-base font-bold hover:bg-indigo-50"
        >
          もういちど
        </button>
      </div>
    </div>
  );
}

/** 例文の見出し語を空所にする */
export function blank(ex: string, en: string): string {
  return ex.replace(new RegExp(`\\b${en}\\b`, "i"), "_____");
}

/** 例文の見出し語を太字にする */
export function Highlight({ text, word }: { text: string; word: string }) {
  const m = text.match(new RegExp(`\\b${word}\\b`, "i"));
  if (!m || m.index === undefined) return <>{text}</>;
  return (
    <>
      {text.slice(0, m.index)}
      <strong className="text-indigo-700">{m[0]}</strong>
      {text.slice(m.index + m[0].length)}
    </>
  );
}
