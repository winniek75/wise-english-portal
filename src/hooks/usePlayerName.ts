"use client";
import { useState, useEffect, useCallback } from "react";

const KEY = "wise-player-name";

export function getPlayerName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY) || "";
}

export function setPlayerName(name: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, name.trim());
}

export function usePlayerName() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getPlayerName());
  }, []);

  const update = useCallback((n: string) => {
    const trimmed = n.trim();
    setPlayerName(trimmed);
    setName(trimmed);
  }, []);

  return { playerName: name, setPlayerName: update } as const;
}
