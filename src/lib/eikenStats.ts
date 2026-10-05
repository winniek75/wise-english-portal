// 英検トレーナーの「にがて」記録（この端末だけに保存。出題の優先順位に使う）
const KEY = "wise_eiken_stats_v1";

export interface Rec {
  /** 正解した回数 */
  c: number;
  /** まちがえた回数 */
  x: number;
  /** 連続正解 */
  s: number;
  /** 最後に答えた時刻 */
  t: number;
}

export type Stats = Record<string, Rec>;

export function loadStats(): Stats {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : {};
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function record(id: string, ok: boolean) {
  try {
    const all = loadStats();
    const r = all[id] ?? { c: 0, x: 0, s: 0, t: 0 };
    all[id] = {
      c: r.c + (ok ? 1 : 0),
      x: r.x + (ok ? 0 : 1),
      s: ok ? r.s + 1 : 0,
      t: Date.now(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* 保存できない端末でも練習は続けられる */
  }
}

const DAY = 24 * 60 * 60 * 1000;

/** 出題の重み：まだ・まちがえた・しばらく見ていないものほど大きい */
export function weight(r: Rec | undefined, now: number): number {
  if (!r) return 3;
  const stale = Math.min(7, (now - r.t) / DAY) * 0.3;
  const w = 1 + r.x * 1.5 - Math.min(r.s, 4) * 0.6 + (r.s === 0 ? 2 : 0) + stale;
  return Math.max(0.2, w);
}

/** にがて（最後にまちがえたまま）かどうか */
export const isWeak = (r: Rec | undefined) => !!r && r.x > 0 && r.s === 0;

/** 重みつきで n 個えらぶ（重複なし） */
export function pickWeighted<T extends { id: string }>(items: T[], n: number): T[] {
  const stats = loadStats();
  const now = Date.now();
  const pool = items.map((item) => ({ item, w: weight(stats[item.id], now) }));
  const out: T[] = [];
  while (out.length < n && pool.length) {
    const total = pool.reduce((a, p) => a + p.w, 0);
    let r = Math.random() * total;
    let i = 0;
    for (; i < pool.length - 1; i++) {
      r -= pool[i].w;
      if (r <= 0) break;
    }
    out.push(pool[i].item);
    pool.splice(i, 1);
  }
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    /* 読み上げのない端末では何もしない */
  }
}
