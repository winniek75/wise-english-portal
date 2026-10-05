"use client";

import { useEffect, useState } from "react";
import type { ChoiceQuestion, GradeInfo, GrammarUnit, OrderQuestion, Question } from "@/data/eiken";
import { pickWeighted, record, shuffle, speak } from "@/lib/eikenStats";
import { OptionButton, PrimaryButton, ResultCard, Shell, SpeakButton, Verdict } from "./ui";

const COUNT = 10;

type Item =
  | { q: ChoiceQuestion; options: string[]; retry?: boolean }
  | { q: OrderQuestion; tiles: string[]; retry?: boolean };

const fullOf = (q: Question) =>
  q.type === "choice" ? q.q.replace("___", q.options[q.answer]) : q.full;

function shuffledTiles(words: string[]): string[] {
  for (let n = 0; n < 8; n++) {
    const t = shuffle(words);
    if (t.join(" ") !== words.join(" ")) return t;
  }
  return [...words].reverse();
}

const makeItem = (q: Question, retry = false): Item =>
  q.type === "choice"
    ? { q, options: shuffle(q.options), retry }
    : { q, tiles: shuffledTiles(q.words), retry };

/** 文法ドリル：ポイントを読む → 10問（にがて優先）→ まちがえた問題はもう1回 */
export function GrammarDrill({ unit, grade }: { unit: GrammarUnit; grade: GradeInfo }) {
  const backHref = `/course/${grade.courseId}`;
  const hasPoints = unit.points.length > 0;
  const [phase, setPhase] = useState<"points" | "quiz" | "done">(hasPoints ? "points" : "quiz");
  const [queue, setQueue] = useState<Item[] | null>(null);
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [placed, setPlaced] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState<Question[]>([]);

  useEffect(() => {
    const picked = pickWeighted(unit.questions, Math.min(COUNT, unit.questions.length));
    // 並べかえは後半に寄せる（先に形を確かめてから組み立てる）
    const ordered = [...picked.filter((q) => q.type === "choice"), ...picked.filter((q) => q.type === "order")];
    setQueue(ordered.map((q) => makeItem(q)));
    setI(0);
    setChosen(null);
    setPlaced([]);
    setChecked(false);
    setFirstTry(0);
    setMissed([]);
  }, [unit, round]);

  const total = Math.min(COUNT, unit.questions.length);
  const item = queue?.[i];

  const finish = (right: boolean) => {
    if (!item) return;
    if (!item.retry) {
      record(`q:${item.q.id}`, right);
      if (right) setFirstTry((n) => n + 1);
    }
    if (right) {
      speak(fullOf(item.q));
    } else {
      setMissed((m) => (m.some((x) => x.id === item.q.id) ? m : [...m, item.q]));
      setQueue((q) => (q ? [...q, makeItem(item.q, true)] : q));
    }
  };

  const choose = (opt: string) => {
    if (!item || item.q.type !== "choice" || chosen !== null) return;
    setChosen(opt);
    finish(opt === item.q.options[item.q.answer]);
  };

  const orderRight =
    item && item.q.type === "order" && "tiles" in item
      ? placed.map((p) => item.tiles[p]).join(" ").toLowerCase() === item.q.words.join(" ").toLowerCase()
      : false;

  const check = () => {
    if (!item || item.q.type !== "order" || checked) return;
    setChecked(true);
    finish(orderRight);
  };

  const next = () => {
    if (!queue) return;
    if (i + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    setChosen(null);
    setPlaced([]);
    setChecked(false);
    setI(i + 1);
  };

  const restart = () => {
    setRound((r) => r + 1);
    setPhase("quiz");
  };

  const answered = item ? (item.q.type === "choice" ? chosen !== null : checked) : false;
  const ok = item ? (item.q.type === "choice" ? chosen === item.q.options[item.q.answer] : orderRight) : false;
  const progress = phase === "done" ? 1 : phase === "points" || !queue ? 0 : i / queue.length;

  return (
    <Shell title={unit.title} sub={`${grade.label} 文法ドリル`} backHref={backHref} progress={progress}>
      {phase === "points" && (
        <div className="space-y-5">
          <section className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6">
            <h2 className="text-sm font-bold text-gray-500 mb-3">今日のポイント</h2>
            <ol className="space-y-2">
              {unit.points.map((p, n) => (
                <li key={n} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 text-sm font-bold flex items-center justify-center">
                    {n + 1}
                  </span>
                  <p className="font-bold text-gray-900 leading-relaxed">{p}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6">
            <h2 className="text-sm font-bold text-gray-500 mb-3">れいぶん（音声をきいて、声に出して読もう）</h2>
            <ul className="space-y-3">
              {unit.examples.map((e, n) => (
                <li key={n} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{e.en}</p>
                    <p className="text-sm text-gray-500">{e.ja}</p>
                  </div>
                  <SpeakButton text={e.en} />
                </li>
              ))}
            </ul>
          </section>
          <PrimaryButton onClick={() => setPhase("quiz")}>{total}問にちょうせん</PrimaryButton>
        </div>
      )}

      {phase === "quiz" && !item && <p className="text-gray-500">じゅんび中…</p>}

      {phase === "quiz" && item && queue && (
        <div className="space-y-5">
          <p className="text-sm font-bold text-gray-500">
            {Math.min(i + 1, queue.length)} / {queue.length}
            {item.q.type === "choice" ? "＿＿＿ に入るものをえらぼう" : "日本語に合うように、ことばをならべよう"}
            {item.retry && (
              <span className="ml-2 rounded-full bg-violet-100 text-violet-800 px-2 py-0.5 text-xs">もういちど</span>
            )}
          </p>

          {item.q.type === "choice" && "options" in item && (
            <>
              <div className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed">
                  {answered ? fullOf(item.q) : item.q.q.replace("___", "_____")}
                </p>
                <p className="mt-2 text-sm text-gray-500">{item.q.ja}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {item.options.map((opt) => {
                  const right = opt === (item.q as ChoiceQuestion).options[(item.q as ChoiceQuestion).answer];
                  return (
                    <OptionButton
                      key={opt}
                      disabled={answered}
                      onClick={() => choose(opt)}
                      state={!answered ? "idle" : right ? "right" : opt === chosen ? "wrong" : "dim"}
                    >
                      {opt}
                    </OptionButton>
                  );
                })}
              </div>
            </>
          )}

          {item.q.type === "order" && "tiles" in item && (
            <>
              <div className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6">
                <p className="text-lg font-bold text-gray-900">{item.q.ja}</p>
                <div
                  className={`mt-4 min-h-16 rounded-2xl border-2 border-dashed p-3 flex flex-wrap gap-2 ${
                    checked ? (orderRight ? "border-emerald-400 bg-emerald-50" : "border-rose-300 bg-rose-50") : "border-gray-300 bg-slate-50"
                  }`}
                  aria-label="こたえ"
                >
                  {placed.length === 0 && <span className="text-sm text-gray-400 self-center">下のことばを順にタップ</span>}
                  {placed.map((p, n) => (
                    <button
                      key={p}
                      type="button"
                      disabled={checked}
                      onClick={() => setPlaced(placed.filter((_, k) => k !== n))}
                      className="rounded-xl bg-white ring-1 ring-indigo-300 px-3 py-2 text-lg font-bold text-gray-900"
                    >
                      {item.tiles[p]}
                    </button>
                  ))}
                  <span className="self-end text-2xl font-extrabold text-gray-500" aria-label="文の終わりの記号">
                    {item.q.full.trim().slice(-1)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tiles.map((t, n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={checked || placed.includes(n)}
                    onClick={() => setPlaced([...placed, n])}
                    className="rounded-xl bg-white ring-1 ring-gray-300 px-3 py-2 text-lg font-bold text-gray-900 hover:ring-indigo-400 disabled:text-transparent disabled:bg-gray-100 disabled:ring-gray-200"
                  >
                    {t}
                  </button>
                ))}
              </div>
              {!checked && (
                <PrimaryButton onClick={check} disabled={placed.length !== item.tiles.length}>
                  こたえあわせ
                </PrimaryButton>
              )}
            </>
          )}

          {answered && (
            <div className="space-y-4">
              <Verdict ok={ok} />
              <div className="rounded-2xl bg-white border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-bold text-gray-900">{fullOf(item.q)}</p>
                  <SpeakButton text={fullOf(item.q)} />
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-bold text-indigo-700">なぜ？</span> {item.q.why}
                </p>
              </div>
              <PrimaryButton onClick={next}>{i + 1 >= queue.length ? "けっかを見る" : "つぎへ"}</PrimaryButton>
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <ResultCard
          title={`${unit.title}（1回目で正解した数）`}
          score={firstTry}
          total={total}
          onRetry={restart}
          backHref={backHref}
        >
          {missed.length > 0 && (
            <section className="rounded-2xl bg-white border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-gray-500 mb-2">まちがえた文（声に出して読もう）</h2>
              <ul className="divide-y divide-gray-100">
                {missed.map((q) => (
                  <li key={q.id} className="py-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{fullOf(q)}</p>
                      <p className="text-sm text-gray-500">{q.why}</p>
                    </div>
                    <SpeakButton text={fullOf(q)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </ResultCard>
      )}
    </Shell>
  );
}
