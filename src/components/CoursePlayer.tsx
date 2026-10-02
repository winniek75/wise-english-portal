"use client";

import { useEffect, useMemo, useState } from "react";
import { Course, flatDays, stepGameName, stepKey, stepUrl } from "@/data/courses";
import { getGame } from "@/data/games";
import { loadProgress, saveProgress } from "@/lib/progress";

const roleColor: Record<string, string> = {
  おぼえる: "bg-sky-100 text-sky-800",
  たしかめる: "bg-amber-100 text-amber-800",
  つかう: "bg-emerald-100 text-emerald-800",
  ふくしゅう: "bg-violet-100 text-violet-800",
};

export function CoursePlayer({ course }: { course: Course }) {
  const days = useMemo(() => flatDays(course), [course]);
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(loadProgress()[course.id] ?? []);
    setReady(true);
  }, [course.id]);

  const update = (next: string[]) => {
    setDone(next);
    const all = loadProgress();
    all[course.id] = next;
    saveProgress(all);
  };
  const mark = (key: string) => {
    if (!done.includes(key)) update([...done, key]);
  };
  const toggle = (key: string) =>
    update(done.includes(key) ? done.filter((k) => k !== key) : [...done, key]);

  const dayDone = (n: number, count: number) =>
    Array.from({ length: count }, (_, i) => stepKey(n, i)).every((k) => done.includes(k));

  const today = days.find((d) => !dayDone(d.n, d.day.steps.length));
  const finishedCount = days.filter((d) => dayDone(d.n, d.day.steps.length)).length;

  return (
    <div className="space-y-10">
      {/* 今日の10分 */}
      <section
        aria-labelledby="today"
        className="rounded-3xl bg-white border-2 border-indigo-200 shadow-lg p-5 sm:p-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          <h2 id="today" className="text-2xl font-extrabold text-gray-900">
            {today ? "今日の10分" : "ぜんぶ おわりました 🎉"}
          </h2>
          <p className="text-sm text-gray-500">
            {ready ? `${finishedCount} / ${days.length} 回 おわり` : " "}
          </p>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-5" aria-hidden>
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${(finishedCount / days.length) * 100}%` }}
          />
        </div>

        {today ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              第{today.n}回：<span className="font-bold">{today.day.title}</span>
              <span className="text-gray-400">（{today.week.title}）</span>
            </p>
            <ol className="space-y-3">
              {today.day.steps.map((step, i) => {
                const key = stepKey(today.n, i);
                const isDone = done.includes(key);
                const firstOpen = today.day.steps.findIndex(
                  (_, j) => !done.includes(stepKey(today.n, j))
                );
                const isNext = i === firstOpen;
                return (
                  <li
                    key={key}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-3 sm:p-4 ${
                      isDone
                        ? "border-gray-200 bg-gray-50"
                        : isNext
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <button
                      onClick={() => toggle(key)}
                      aria-label={isDone ? "おわりを とりけす" : "おわりに する"}
                      className={`flex-shrink-0 w-9 h-9 rounded-full border-2 text-lg font-bold flex items-center justify-center ${
                        isDone
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-gray-300 text-gray-400 bg-white"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${roleColor[step.role]}`}>
                          {step.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getGame(step.gameId).icon} {stepGameName(step)}・約{step.minutes}分
                        </span>
                      </div>
                      <p className={`font-bold ${isDone ? "text-gray-400" : "text-gray-900"}`}>
                        {step.label}
                      </p>
                    </div>
                    <a
                      href={stepUrl(step)}
                      onClick={() => mark(key)}
                      className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold ${
                        isNext
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
                      }`}
                    >
                      {isDone ? "もういちど" : "はじめる"}
                    </a>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-sm text-gray-500">
              3つ おわったら、今日は おしまい。つづきは また こんど。
            </p>
          </>
        ) : (
          <button
            onClick={() => update([])}
            className="rounded-xl bg-white text-indigo-700 ring-1 ring-indigo-200 px-4 py-2.5 text-sm font-bold hover:bg-indigo-50"
          >
            さいしょから もういちど
          </button>
        )}
        <p className="mt-3 text-xs text-gray-400">
          ✓ のしるしは この端末だけに保存されます。べつの端末では ひきつがれません。
        </p>
      </section>

      {/* 全体の予定 */}
      <section aria-labelledby="plan">
        <h2 id="plan" className="text-xl font-bold text-gray-900 mb-4">
          ぜんぶの予定
        </h2>
        <div className="space-y-6">
          {course.weeks.map((week, wi) => (
            <div key={wi} className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-6">
              <h3 className="font-bold text-gray-900">{week.title}</h3>
              <p className="text-sm text-gray-500 mb-3">めあて：{week.goal}</p>
              <div className="grid gap-3 md:grid-cols-3">
                {days
                  .filter((d) => d.weekIndex === wi)
                  .map((d) => {
                    const finished = dayDone(d.n, d.day.steps.length);
                    return (
                      <div
                        key={d.n}
                        className={`rounded-xl border p-3 ${
                          finished ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <p className="text-sm font-bold text-gray-900 mb-2">
                          {finished ? "✓ " : ""}第{d.n}回　{d.day.title}
                        </p>
                        <ul className="space-y-1.5">
                          {d.day.steps.map((step, i) => (
                            <li key={i} className="text-sm leading-snug">
                              <a
                                href={stepUrl(step)}
                                onClick={() => mark(stepKey(d.n, i))}
                                className="text-indigo-700 hover:underline"
                              >
                                {done.includes(stepKey(d.n, i)) ? "✓ " : `${i + 1}. `}
                                {step.label}
                              </a>
                              <span className="text-xs text-gray-400">
                                {" "}
                                {stepGameName(step)}・{step.minutes}分
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
