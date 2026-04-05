import { categories } from "@/data/games";

export function HeroSection() {
  const totalGames = categories.reduce(
    (sum, cat) => sum + cat.games.length,
    0
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-float">🎮</div>
        <div
          className="absolute top-20 right-20 text-5xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          📚
        </div>
        <div
          className="absolute bottom-16 left-1/4 text-4xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          ⭐
        </div>
        <div
          className="absolute bottom-10 right-1/3 text-5xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          🎯
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            WISE English Club
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-white/90 mb-2">
            ゲームで楽しく英語を学ぼう！
          </p>
          <p className="text-base sm:text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            フォニックスから英作文まで、{totalGames}
            種類の学習ゲームで英語力アップ
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.titleJa}
                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                  {cat.games.length}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto fill-[#f0f4ff]">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
