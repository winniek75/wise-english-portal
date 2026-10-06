import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { grades, mixId, unitsOf, wordSets } from "@/data/eiken";

export const metadata: Metadata = {
  title: "英検対策トレーナー（4級・3級・準2級） | WISE English Club",
  description:
    "英検4級・3級・準2級の単語と文法を、家庭で1回10分ずつ反復練習。まちがえた問題は次の回に先に出ます。",
};

export default function EikenHub() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <a href="/" className="text-sm text-white/80 hover:text-white">
              ← 学習ホーム
            </a>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold">🎯 英検対策トレーナー</h1>
            <p className="mt-3 text-white/85 max-w-2xl">
              単語は1セット6語を「見る・聞く → 意味をえらぶ → 例文に入れる」。文法は1回10問。
              まちがえた問題はその場でもう1回、つぎの回にも先に出ます。まよったら12週間コースからどうぞ。
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
          {grades.map((g) => {
            const sets = wordSets(g.key);
            const units = unitsOf(g.key);
            return (
              <section key={g.key} id={`grade-${g.key}`} className="rounded-3xl bg-white border border-gray-200 overflow-hidden scroll-mt-20">
                <div className={`bg-gradient-to-r ${g.gradient} text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3`}>
                  <div>
                    <h2 className="text-2xl font-extrabold">{g.label}</h2>
                    <p className="text-sm text-white/85">
                      {g.level}・単語{sets.length * 6}語・文法{units.length}単元
                    </p>
                  </div>
                  <a
                    href={`/course/${g.courseId}`}
                    className="rounded-xl bg-white text-gray-900 px-4 py-2.5 text-sm font-bold hover:bg-gray-100"
                  >
                    12週間コース（今日の10分）へ
                  </a>
                </div>
                <div className="p-5 sm:p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">文法ドリル（1回10問）</h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {units.map((u) => (
                        <li key={u.id}>
                          <a
                            href={`/eiken/grammar/${u.id}`}
                            className="block rounded-xl border border-gray-200 px-4 py-3 font-bold text-indigo-700 hover:bg-indigo-50"
                          >
                            {u.title}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={`/eiken/grammar/${mixId(g.key)}`}
                          className="block rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 font-bold text-violet-800 hover:bg-violet-100"
                        >
                          まぜこぜ（にがて優先）
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">単語（1セット6語）</h3>
                    <ul className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                      {sets.map((s) => (
                        <li key={s.n}>
                          <a
                            href={`/eiken/words/${g.key}/${s.n}`}
                            className="block rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-indigo-50"
                          >
                            <span className="font-bold text-indigo-700">セット{s.n}</span>
                            <span className="block text-xs text-gray-500">{s.theme}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`/eiken/review/${g.key}/${sets.length}`}
                      className="mt-3 inline-block rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-800 hover:bg-violet-100"
                    >
                      ぜんぶの単語から ふくしゅう12問（にがて優先）
                    </a>
                  </div>
                </div>
              </section>
            );
          })}
          <p className="text-xs text-gray-500">
            正解・不正解の記録は、にがてな問題を先に出すために、この端末だけに保存されます。保護者ページの学習記録には入りません。
            英検®は、公益財団法人 日本英語検定協会の登録商標です。このコンテンツは、公益財団法人 日本英語検定協会の承認や推奨、その他の検討を受けたものではありません。
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
