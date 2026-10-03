"use client";

import { Game } from "@/data/games";
import type { ProgressState } from "@/hooks/useProgress";

interface GameCardProps {
  game: Game;
  index: number;
  progressState?: ProgressState;
  onStart?: (gameId: string) => void;
}

const BADGE: Record<
  Exclude<ProgressState, "none">,
  { label: string; cls: string }
> = {
  started: { label: "開始済み", cls: "bg-amber-100 text-amber-700" },
  completed: { label: "完了", cls: "bg-emerald-100 text-emerald-700" },
  mastered: { label: "★ マスター", cls: "bg-yellow-100 text-yellow-700" },
};

export function GameCard({ game, index, progressState, onStart }: GameCardProps) {
  const badge =
    progressState && progressState !== "none" ? BADGE[progressState] : null;

  return (
    <a
      href={game.url}
      className={`card-hover flex flex-col rounded-2xl border-2 ${game.color} p-5 sm:p-6 animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => onStart?.(game.id)}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{game.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-bold text-gray-900 text-lg leading-tight">
              {game.titleJa}
            </h4>
            {badge && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.cls}`}
              >
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2">{game.title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {game.description}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-white/80 ring-1 ring-gray-200 px-2 py-1.5">
          <dt className="text-gray-400">対象</dt>
          <dd className="font-medium text-gray-700">{game.level}</dd>
        </div>
        <div className="rounded-lg bg-white/80 ring-1 ring-gray-200 px-2 py-1.5">
          <dt className="text-gray-400">めやす</dt>
          <dd className="font-medium text-gray-700">
            {/^[0-9]/.test(game.minutes) ? `${game.minutes}分` : game.minutes}
          </dd>
        </div>
        <div className="rounded-lg bg-white/80 ring-1 ring-gray-200 px-2 py-1.5">
          <dt className="text-gray-400">練習すること</dt>
          <dd className="font-medium text-gray-700">{game.skill}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {game.use === "class" && (
          <span className="inline-flex items-center rounded-md bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
            授業用
          </span>
        )}
        {game.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-md bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 flex justify-end">
        <span className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-bold">
          {game.use === "class" ? "ひらく" : "はじめる"} →
        </span>
      </div>
    </a>
  );
}
