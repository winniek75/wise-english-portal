"use client";

import { Step, stepUrl, stepGameName } from "@/data/courses";
import { getGame } from "@/data/games";

const roleEmoji: Record<string, string> = {
  おぼえる: "👀",
  たしかめる: "✅",
  つかう: "🎮",
  ふくしゅう: "🔄",
};

const roleBg: Record<string, string> = {
  おぼえる: "from-sky-400 to-blue-500",
  たしかめる: "from-amber-400 to-orange-500",
  つかう: "from-emerald-400 to-green-500",
  ふくしゅう: "from-violet-400 to-purple-500",
};

interface Props {
  step: Step;
  onClose: () => void;
  onDone: () => void;
}

export function MissionModal({ step, onClose, onDone }: Props) {
  const game = getGame(step.gameId);
  const url = stepUrl(step);
  const guide = step.guide ?? [];

  const handleGo = () => {
    onDone();
    window.open(url, "_blank", "noopener");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-br ${roleBg[step.role] ?? "from-gray-400 to-gray-500"} p-5 sm:p-6 text-center text-white`}
        >
          <div className="text-4xl sm:text-5xl mb-2">{game.icon}</div>
          <p className="text-base sm:text-lg font-extrabold">{stepGameName(step)}</p>
          <div className="inline-flex items-center gap-1.5 mt-2 bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
            {roleEmoji[step.role]} {step.role}
          </div>
        </div>

        {/* Guide */}
        <div className="p-4 sm:p-6">
          <p className="text-sm font-bold text-gray-500 mb-3">やること</p>
          {guide.length > 0 ? (
            <ol className="space-y-2.5">
              {guide.map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-base font-bold text-gray-800 leading-snug pt-0.5">
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-base font-bold text-gray-800">{step.label}</p>
          )}

          <p className="mt-4 text-xs text-gray-400 text-center">
            やく{step.minutes}ぷん
          </p>

          <button
            onClick={handleGo}
            className="mt-5 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg sm:text-xl font-extrabold py-4 shadow-lg transition-transform active:scale-95 min-h-[56px]"
          >
            GO!
          </button>
          <button
            onClick={onClose}
            className="mt-2 w-full text-sm text-gray-400 font-bold py-2 min-h-[44px]"
          >
            もどる
          </button>
        </div>
      </div>
    </div>
  );
}
