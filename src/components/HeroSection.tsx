export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-24 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
          今日の10分で、使える英語をふやそう
        </h1>
        <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto">
          先生がえらんだ順番で、1回3ステップ。おわったら、今日はおしまい。
          <br className="hidden sm:block" />
          会員登録なしで、すぐ始められます。
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto fill-[#f0f4ff]" aria-hidden>
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
