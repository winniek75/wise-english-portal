"use client";

import { useCallback, useEffect, useState } from "react";
import type { GradeInfo, Word, WordSet } from "@/data/eiken";
import { shuffle, speak } from "@/lib/eikenStats";
import { Highlight, PrimaryButton, ResultCard, Shell, SpeakButton } from "./ui";
import { makeTask, MissedList, Task, WordQuiz } from "./WordQuiz";

type Phase = "learn" | "quiz" | "done";

/** 1セット6語：見る・聞く → 意味をえらぶ → 例文に入れる */
export function WordTrainer({
  grade,
  set,
  pool,
}: {
  grade: GradeInfo;
  set: WordSet;
  /** 選択肢づくりに使う、その級の単語ぜんぶ */
  pool: Word[];
}) {
  const backHref = `/course/${grade.courseId}`;
  const [phase, setPhase] = useState<Phase>("learn");
  const [i, setI] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ratio, setRatio] = useState(0);
  const [result, setResult] = useState<{ firstTry: number; total: number; missed: Word[] } | null>(null);

  const word = set.words[i];

  useEffect(() => {
    if (phase === "learn" && i > 0) speak(word.en);
  }, [phase, i, word.en]);

  const startQuiz = () => {
    setTasks([
      ...shuffle(set.words).map((w) => makeTask("meaning", w, pool, set.words)),
      ...shuffle(set.words).map((w) => makeTask("blank", w, pool, set.words)),
    ]);
    setRatio(0);
    setPhase("quiz");
  };

  const restart = () => {
    setI(0);
    setResult(null);
    setPhase("learn");
  };

  const onProgress = useCallback((r: number) => setRatio(r), []);

  const progress =
    phase === "learn" ? (i / set.words.length) * 0.4 : phase === "quiz" ? 0.4 + ratio * 0.6 : 1;

  return (
    <Shell
      title={`${grade.label} 単語 セット${set.n}`}
      sub={`${set.theme}・6語`}
      backHref={backHref}
      progress={progress}
    >
      {phase === "learn" && (
        <div className="space-y-5">
          <p className="text-sm font-bold text-gray-500">
            おぼえる {i + 1} / {set.words.length}　音声をきいて、声に出して読もう
          </p>
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-bold">
                  {word.pos}
                </span>
                <p className="mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900 break-words">{word.en}</p>
                <p className="mt-2 text-2xl font-bold text-indigo-700">{word.ja}</p>
              </div>
              <SpeakButton text={word.en} />
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-gray-900 leading-relaxed">
                  <Highlight text={word.ex} word={word.en} />
                </p>
                <p className="mt-1 text-sm text-gray-500">{word.exJa}</p>
              </div>
              <SpeakButton text={word.ex} label="例文をきく" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setI(Math.max(0, i - 1))}
              disabled={i === 0}
              className="rounded-2xl bg-white text-indigo-700 ring-1 ring-indigo-200 px-3 py-3.5 font-bold disabled:text-gray-300 disabled:ring-gray-200"
            >
              もどる
            </button>
            <div className="col-span-2">
              {i + 1 < set.words.length ? (
                <PrimaryButton onClick={() => setI(i + 1)}>つぎのことば</PrimaryButton>
              ) : (
                <PrimaryButton onClick={startQuiz}>クイズへ（12問）</PrimaryButton>
              )}
            </div>
          </div>
        </div>
      )}

      {phase === "quiz" && (
        <WordQuiz
          tasks={tasks}
          pool={pool}
          onProgress={onProgress}
          onDone={(r) => {
            setResult(r);
            setPhase("done");
          }}
        />
      )}

      {phase === "done" && result && (
        <ResultCard
          title={`セット${set.n} のけっか（1回目で正解した数）`}
          score={result.firstTry}
          total={result.total}
          onRetry={restart}
          backHref={backHref}
        >
          <MissedList words={result.missed} />
        </ResultCard>
      )}
    </Shell>
  );
}
