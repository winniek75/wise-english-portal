"use client";

import { useEffect, useState } from "react";
import type { Word } from "@/data/eiken";
import { record, shuffle, speak } from "@/lib/eikenStats";
import { blank, OptionButton, PrimaryButton, SpeakButton, Verdict } from "./ui";

export type TaskKind = "meaning" | "word" | "blank";

export interface Task {
  kind: TaskKind;
  word: Word;
  options: string[];
  answer: string;
  /** まちがえて出しなおした問題（点数には数えない） */
  retry?: boolean;
}

const pickOthers = (pool: Word[], word: Word, n: number, key: "ja" | "en") => {
  const samePos = pool.filter((w) => w.id !== word.id && w.pos === word.pos && w[key] !== word[key]);
  const rest = pool.filter((w) => w.id !== word.id && w.pos !== word.pos && w[key] !== word[key]);
  const picked = [...shuffle(samePos), ...shuffle(rest)].slice(0, n);
  return picked.map((w) => w[key]);
};

/** 1語ぶんの問題をつくる。blank の選択肢は同じセットの語だけ（例文がそう書かれているため） */
export function makeTask(kind: TaskKind, word: Word, pool: Word[], setMates: Word[]): Task {
  if (kind === "meaning") {
    return { kind, word, answer: word.ja, options: shuffle([word.ja, ...pickOthers(pool, word, 3, "ja")]) };
  }
  if (kind === "word") {
    return { kind, word, answer: word.en, options: shuffle([word.en, ...pickOthers(pool, word, 3, "en")]) };
  }
  const mates = shuffle(setMates.filter((w) => w.id !== word.id)).slice(0, 3);
  return { kind, word, answer: word.en, options: shuffle([word.en, ...mates.map((w) => w.en)]) };
}

const prompt: Record<TaskKind, string> = {
  meaning: "この英語の意味は？",
  word: "この意味の英語は？",
  blank: "＿＿＿ に入ることばは？",
};

export function WordQuiz({
  tasks,
  pool,
  onProgress,
  onDone,
}: {
  tasks: Task[];
  pool: Word[];
  onProgress: (ratio: number) => void;
  onDone: (result: { firstTry: number; total: number; missed: Word[] }) => void;
}) {
  const [queue, setQueue] = useState<Task[]>(tasks);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);

  const task = queue[i];
  const total = tasks.length;

  useEffect(() => {
    onProgress(i / queue.length);
  }, [i, queue.length, onProgress]);

  useEffect(() => {
    if (task && task.kind === "meaning") speak(task.word.en);
  }, [task]);

  if (!task) return null;
  const answered = chosen !== null;
  const ok = chosen === task.answer;

  const choose = (opt: string) => {
    if (answered) return;
    setChosen(opt);
    const right = opt === task.answer;
    if (!task.retry) {
      record(task.word.id, right);
      if (right) setFirstTry((n) => n + 1);
    }
    if (right) {
      if (task.kind !== "meaning") speak(task.kind === "blank" ? task.word.ex : task.word.en);
    } else {
      setMissed((m) => (m.some((w) => w.id === task.word.id) ? m : [...m, task.word]));
      // まちがえた問題は、選択肢を作りなおして最後にもう1回出す
      const again = makeTask(
        task.kind,
        task.word,
        pool,
        pool.filter((w) => w.set === task.word.set)
      );
      setQueue((q) => [...q, { ...again, retry: true }]);
    }
  };

  const next = () => {
    if (i + 1 >= queue.length) {
      onProgress(1);
      onDone({ firstTry, total, missed });
      return;
    }
    setChosen(null);
    setI(i + 1);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm font-bold text-gray-500">
        {prompt[task.kind]}
        {task.retry && <span className="ml-2 rounded-full bg-violet-100 text-violet-800 px-2 py-0.5 text-xs">もういちど</span>}
      </p>

      <div className="rounded-3xl bg-white border border-gray-200 p-5 sm:p-6">
        {task.kind === "meaning" && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 break-words">{task.word.en}</p>
            <SpeakButton text={task.word.en} />
          </div>
        )}
        {task.kind === "word" && (
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{task.word.ja}</p>
        )}
        {task.kind === "blank" && (
          <>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed">
              {answered ? task.word.ex : blank(task.word.ex, task.word.en)}
            </p>
            <p className="mt-2 text-sm text-gray-500">{task.word.exJa}</p>
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {task.options.map((opt) => (
          <OptionButton
            key={opt}
            disabled={answered}
            onClick={() => choose(opt)}
            state={
              !answered ? "idle" : opt === task.answer ? "right" : opt === chosen ? "wrong" : "dim"
            }
          >
            {opt}
          </OptionButton>
        ))}
      </div>

      {answered && (
        <div className="space-y-4">
          <Verdict ok={ok} />
          <div className="rounded-2xl bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold text-gray-900">
                {task.word.en} <span className="text-gray-400">＝</span> {task.word.ja}
              </p>
              <SpeakButton text={task.word.en} />
            </div>
            {task.kind !== "blank" && (
              <p className="mt-1 text-sm text-gray-600">
                {task.word.ex}
                <span className="block text-gray-400">{task.word.exJa}</span>
              </p>
            )}
          </div>
          <PrimaryButton onClick={next}>{i + 1 >= queue.length ? "けっかを見る" : "つぎへ"}</PrimaryButton>
        </div>
      )}
    </div>
  );
}

export function MissedList({ words }: { words: Word[] }) {
  if (!words.length) return null;
  return (
    <section className="rounded-2xl bg-white border border-gray-200 p-4">
      <h2 className="text-sm font-bold text-gray-500 mb-2">まちがえたことば（声に出して読もう）</h2>
      <ul className="divide-y divide-gray-100">
        {words.map((w) => (
          <li key={w.id} className="py-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-gray-900">
                {w.en} <span className="text-gray-400">＝</span> {w.ja}
              </p>
              <p className="text-sm text-gray-500">{w.ex}</p>
            </div>
            <SpeakButton text={`${w.en}. ${w.ex}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
