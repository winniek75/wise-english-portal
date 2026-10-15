"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Shell, SpeakButton } from "@/components/eiken/ui";
import { speak } from "@/lib/eikenStats";
import {
  displayPattern,
  spellingGroups,
  splitWord,
  type SpellingGroup,
  type SpellingWord,
} from "@/data/phonics/spellings";

type Mode = "choose" | "sort";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SpellingDojo() {
  const [active, setActive] = useState<Set<string>>(() => new Set(spellingGroups.map((g) => g.id)));
  const [mode, setMode] = useState<Mode>("choose");
  const [right, setRight] = useState(0);
  const [total, setTotal] = useState(0);

  const groups = useMemo(() => spellingGroups.filter((g) => active.has(g.id)), [active]);

  const toggleGroup = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else next.add(id);
      return next;
    });
  };

  const record = (ok: boolean) => {
    setTotal((t) => t + 1);
    if (ok) setRight((r) => r + 1);
  };

  return (
    <Shell
      title="Spelling Dojo"
      sub="同音異綴れんしゅう（Jolly Phonics）"
      backHref="/#games"
      progress={total ? right / total : undefined}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">れんしゅうする音（タップで切りかえ）</p>
          <p className="text-sm font-bold text-gray-700 tabular-nums" aria-live="polite">
            {right} / {total}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {spellingGroups.map((g) => {
            const on = active.has(g.id);
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleGroup(g.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ring-1 min-h-[36px] ${
                  on
                    ? "bg-indigo-600 text-white ring-indigo-600"
                    : "bg-white text-gray-600 ring-gray-200 hover:bg-indigo-50"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2" role="tablist">
          {(
            [
              ["choose", "えらぶ"],
              ["sort", "しわけ"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-xl px-4 py-2.5 font-bold min-h-[44px] ${
                mode === m
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "choose" ? (
          <ChooseMode groups={groups} onAnswer={record} />
        ) : (
          <SortMode groups={groups} onAnswer={record} />
        )}

        <p className="text-xs text-gray-500">
          Jolly Phonics の alternative spellings（同じ音・ちがう綴り）に準拠。🔊は端末の読み上げ機能を使います。正解数はこの画面を開いている間だけ数えます。
        </p>
      </div>
    </Shell>
  );
}

/* ---------- えらぶ ---------- */

interface Q {
  group: SpellingGroup;
  w: SpellingWord;
  options: string[];
}

function makeQ(groups: SpellingGroup[]): Q {
  const group = pick(groups);
  const w = pick(group.words);
  return { group, w, options: shuffle(group.spellings) };
}

function ChooseMode({ groups, onAnswer }: { groups: SpellingGroup[]; onAnswer: (ok: boolean) => void }) {
  const [q, setQ] = useState<Q>(() => makeQ(groups));
  const [picked, setPicked] = useState<string | null>(null);

  const next = useCallback(() => {
    const nq = makeQ(groups);
    setQ(nq);
    setPicked(null);
    speak(nq.w.word);
  }, [groups]);

  // 音グループが変わったら新しい問題に
  useEffect(() => {
    setQ(makeQ(groups));
    setPicked(null);
  }, [groups]);

  useEffect(() => {
    if (picked === q.w.pattern) {
      const t = setTimeout(next, 1100);
      return () => clearTimeout(t);
    }
  }, [picked, q, next]);

  const answer = (s: string) => {
    if (picked) return;
    setPicked(s);
    onAnswer(s === q.w.pattern);
  };

  const [a, v, c, e, z] = splitWord(q.w.word, q.w.pattern);
  const isSplit = q.w.pattern.includes("_");
  const revealed = picked !== null;
  const Gap = ({ ch }: { ch: string }) => (
    <span className="inline-block min-w-[1.4em] border-b-4 border-indigo-500 text-indigo-600 text-center">
      {revealed ? ch : " "}
    </span>
  );

  return (
    <div className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6 text-center space-y-4">
      <div className="text-6xl leading-none" aria-hidden>
        {q.w.pic}
      </div>
      <p className="text-4xl sm:text-5xl font-extrabold tracking-wider text-gray-900 font-mono">
        {a}
        <Gap ch={v} />
        {isSplit && (
          <>
            {c}
            <Gap ch={e} />
          </>
        )}
        {z}
      </p>
      <p className="text-sm text-gray-500">
        {q.group.sound} の音は どの綴り？
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.options.map((s) => {
          const isRight = s === q.w.pattern;
          const state = !revealed
            ? "idle"
            : isRight
              ? "right"
              : s === picked
                ? "wrong"
                : "dim";
          const cls = {
            idle: "border-gray-200 bg-white text-gray-900 hover:border-indigo-400 hover:bg-indigo-50",
            right: "border-emerald-500 bg-emerald-50 text-emerald-900",
            wrong: "border-rose-400 bg-rose-50 text-rose-900",
            dim: "border-gray-200 bg-white text-gray-400",
          }[state];
          return (
            <button
              key={s}
              type="button"
              disabled={revealed}
              onClick={() => answer(s)}
              className={`rounded-2xl border-2 px-2 py-4 text-2xl font-extrabold min-h-[64px] transition-colors ${cls}`}
            >
              {displayPattern(s)}
            </button>
          );
        })}
      </div>

      <p
        role="status"
        className={`min-h-[1.75rem] text-lg font-extrabold ${
          !revealed ? "" : picked === q.w.pattern ? "text-emerald-700" : "text-rose-700"
        }`}
      >
        {!revealed
          ? ""
          : picked === q.w.pattern
            ? "せいかい！ Well done!"
            : `ざんねん… 正しくは ${displayPattern(q.w.pattern)}`}
      </p>

      <div className="flex items-center justify-center gap-3">
        <SpeakButton text={q.w.word} />
        <button
          type="button"
          onClick={next}
          className="rounded-2xl bg-indigo-600 text-white px-6 py-3 font-bold min-h-[48px] hover:bg-indigo-700"
        >
          つぎへ ▶
        </button>
      </div>
    </div>
  );
}

/* ---------- しわけ ---------- */

function SortMode({ groups, onAnswer }: { groups: SpellingGroup[]; onAnswer: (ok: boolean) => void }) {
  const [group, setGroup] = useState<SpellingGroup>(() => pick(groups));
  const [pool, setPool] = useState<SpellingWord[]>([]);
  const [placed, setPlaced] = useState<Record<string, SpellingWord[]>>({});
  const [sel, setSel] = useState<SpellingWord | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const setup = useCallback(
    (g: SpellingGroup) => {
      setGroup(g);
      setPool(shuffle(g.words).slice(0, Math.min(9, g.words.length)));
      setPlaced(Object.fromEntries(g.spellings.map((s) => [s, []])));
      setSel(null);
      setMsg(null);
    },
    [],
  );

  useEffect(() => {
    setup(pick(groups));
  }, [groups, setup]);

  const drop = (s: string) => {
    if (!sel) return;
    const ok = sel.pattern === s;
    onAnswer(ok);
    if (ok) {
      const nextPool = pool.filter((w) => w !== sel);
      setPool(nextPool);
      setPlaced((p) => ({ ...p, [s]: [...p[s], sel] }));
      setMsg(nextPool.length === 0 ? { text: "ぜんぶ できた！ Great job!", ok: true } : null);
    } else {
      setMsg({ text: `${sel.word} は ${displayPattern(s)} じゃないよ`, ok: false });
    }
    setSel(null);
  };

  const done = pool.length === 0;

  return (
    <div className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6 space-y-4">
      <p className="text-center text-sm text-gray-500">
        {group.label}：単語をタップ → 入れるれつをタップ
      </p>

      <div className="flex flex-wrap justify-center gap-2 min-h-[56px]">
        {pool.map((w) => {
          const on = sel === w;
          return (
            <button
              key={w.word}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setSel(on ? null : w);
                speak(w.word);
              }}
              className={`rounded-xl border-2 px-3 py-2 text-lg font-extrabold min-h-[44px] ${
                on
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                  : "border-gray-200 bg-white text-gray-900 hover:border-indigo-300"
              }`}
            >
              {w.word}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {group.spellings.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => drop(s)}
            disabled={!sel}
            className={`rounded-2xl border-2 p-2 min-h-[120px] flex flex-col gap-1.5 text-left transition-colors ${
              done
                ? "border-emerald-400 bg-emerald-50"
                : sel
                  ? "border-indigo-400 bg-indigo-50/40 border-solid"
                  : "border-dashed border-gray-300 bg-gray-50"
            }`}
          >
            <span className="block text-center text-xl font-extrabold text-indigo-700">
              {displayPattern(s)}
            </span>
            {placed[s]?.map((w) => (
              <span
                key={w.word}
                className="block rounded-lg bg-white border border-emerald-300 px-2 py-1 text-center text-sm font-bold text-gray-800"
              >
                {w.word}
              </span>
            ))}
          </button>
        ))}
      </div>

      <p
        role="status"
        className={`min-h-[1.75rem] text-center text-lg font-extrabold ${
          !msg ? "" : msg.ok ? "text-emerald-700" : "text-rose-700"
        }`}
      >
        {msg?.text ?? ""}
      </p>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setup(pick(groups))}
          className="rounded-2xl bg-indigo-600 text-white px-6 py-3 font-bold min-h-[48px] hover:bg-indigo-700"
        >
          {done ? "つぎのセット ▶" : "もういちど"}
        </button>
      </div>
    </div>
  );
}
