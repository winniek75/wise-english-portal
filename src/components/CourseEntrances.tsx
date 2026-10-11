"use client";

import { useEffect, useState } from "react";
import { courses, flatDays, stepKey } from "@/data/courses";
import { loadProgress } from "@/lib/progress";

export function CourseEntrances() {
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <section id="courses" className="-mt-10 relative z-10 scroll-mt-20 px-3 sm:px-0">
      <h2 className="sr-only">目的からえらぶ</h2>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {courses.map((course) => {
          const days = flatDays(course);
          const done = progress[course.id] ?? [];
          const finished = days.filter((d) =>
            d.day.steps.every((_, i) => done.includes(stepKey(d.n, i)))
          ).length;
          const started = done.length > 0;
          return (
            <a
              key={course.id}
              href={`/course/${course.id}`}
              className="card-hover block rounded-3xl bg-white border border-gray-200 shadow-md overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${course.gradient} h-2`} />
              <div className="p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-2">{course.icon}</div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.audience}</p>
                <p className="text-xs text-gray-500 mt-2">{course.rhythm}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {started ? `${finished} / ${days.length} 回 おわり` : " "}
                  </span>
                  <span className="rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-bold min-h-[44px] flex items-center">
                    {started && finished < days.length ? "つづきから" : "今日の10分へ"}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
