"use client";

import { categories } from "@/data/games";
import { CourseEntrances } from "@/components/CourseEntrances";
import { CategorySection } from "@/components/CategorySection";
import { useProgress } from "@/hooks/useProgress";

export function PortalContent() {
  const { progress, markStarted } = useProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <CourseEntrances />

      <div id="games" className="pt-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          ゲームを自分でえらぶ
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          対象・めやす時間・練習することを見てえらべます。まよったら上のコースからどうぞ。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex items-center gap-1.5 bg-white hover:bg-indigo-50 rounded-full px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200"
            >
              <span>{cat.icon}</span>
              {cat.titleJa}
              <span className="text-xs text-gray-400">{cat.games.length}</span>
            </a>
          ))}
        </div>
      </div>

      {categories.map((category, index) => (
        <CategorySection
          key={category.id}
          category={category}
          index={index}
          progress={progress}
          onStart={markStarted}
        />
      ))}
    </div>
  );
}
