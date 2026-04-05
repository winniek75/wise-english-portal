import { Game } from "@/data/games";

interface GameCardProps {
  game: Game;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  return (
    <a
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-hover block rounded-2xl border-2 ${game.color} p-5 sm:p-6 animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{game.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-bold text-gray-900 text-lg leading-tight">
              {game.titleJa}
            </h4>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {game.level}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{game.title}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {game.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end text-sm font-medium text-indigo-600">
        プレイする
        <svg
          className="ml-1 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </a>
  );
}
