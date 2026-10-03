"use client";
import { useState, useEffect, useCallback } from "react";

export type ProgressState = "none" | "started" | "completed" | "mastered";

const STORAGE_KEY = "wise-portal-progress";
const LEVEL: Record<ProgressState, number> = {
  none: 0,
  started: 1,
  completed: 2,
  mastered: 3,
};

function load(): Record<string, ProgressState> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function save(data: Record<string, ProgressState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, ProgressState>>({});

  const advance = useCallback((gameId: string, status: ProgressState) => {
    setProgress((prev) => {
      const current = prev[gameId] || "none";
      if (LEVEL[status] <= LEVEL[current]) return prev;
      const next = { ...prev, [gameId]: status };
      save(next);
      return next;
    });
  }, []);

  useEffect(() => {
    setProgress(load());

    function onMessage(e: MessageEvent) {
      const d = e.data;
      if (d?.type !== "wise-progress" || !d.gameId || !d.status) return;
      advance(d.gameId, d.status);
    }
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setProgress(load());
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, [advance]);

  const markStarted = useCallback(
    (gameId: string) => advance(gameId, "started"),
    [advance],
  );

  return { progress, markStarted };
}
