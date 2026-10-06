"use client";

import { useCallback, useEffect, useState } from "react";
import type { GradeInfo, Word } from "@/data/eiken";
import { pickWeighted } from "@/lib/eikenStats";
import { ResultCard, Shell } from "./ui";
import { makeTask, MissedList, Task, TaskKind, WordQuiz } from "./WordQuiz";

const COUNT = 12;
const KINDS: TaskKind[] = ["meaning", "word", "blank"];

/** これまでのセットから、にがて・しばらく見ていない語を先に12問 */
export function WordReview({
  grade,
  upto,
  words,
}: {
  grade: GradeInfo;
  upto: number;
  /** セット1〜upto の単語 */
  words: Word[];
}) {
  const backHref = `/course/${grade.courseId}`;
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [round, setRound] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [result, setResult] = useState<{ firstTry: number; total: number; missed: Word[] } | null>(null);

  useEffect(() => {
    const picked = pickWeighted(words, Math.min(COUNT, words.length));
    setTasks(
      picked.map((w, i) =>
        makeTask(
          KINDS[i % KINDS.length],
          w,
          words,
          words.filter((x) => x.set === w.set)
        )
      )
    );
    setResult(null);
    setRatio(0);
  }, [words, round]);

  const onProgress = useCallback((r: number) => setRatio(r), []);

  return (
    <Shell
      title={`${grade.label} 単語ふくしゅう`}
      sub={upto === 1 ? "セット1" : `セット1〜${upto} から ${COUNT}問`}
      backHref={backHref}
      progress={result ? 1 : ratio}
    >
      {!tasks && <p className="text-gray-500">じゅんび中…</p>}
      {tasks && !result && (
        <WordQuiz key={round} tasks={tasks} pool={words} onProgress={onProgress} onDone={setResult} />
      )}
      {result && (
        <ResultCard
          title="ふくしゅうのけっか（1回目で正解した数）"
          score={result.firstTry}
          total={result.total}
          onRetry={() => setRound((r) => r + 1)}
          backHref={backHref}
        >
          <MissedList words={result.missed} />
        </ResultCard>
      )}
    </Shell>
  );
}
