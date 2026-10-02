import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCourse, flatDays, stepGameName } from "@/data/courses";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "英語の先生へ｜4週間の家庭学習パック | WISE English Club",
  description:
    "小学生の英語初心者向け。先生がそのまま配れる、1回10分×週3回×4週間の家庭学習コース。",
};

export default function TeachersPage() {
  const course = getCourse("hajimete")!;
  const days = flatDays(course);

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="text-sm text-indigo-200 font-medium">小学生を教える個人の先生・小規模英語教室の方へ</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">
              毎週の「宿題えらび」と「保護者への説明」を、
              <br className="hidden sm:block" />
              4週間ぶん まとめて用意しました
            </h1>
            <p className="mt-4 text-white/85 max-w-2xl">
              英語を習いはじめた小学生向けの家庭学習コースです。1回 約10分、週3回、4週間。
              生徒はリンクを開くだけで、その日の3ステップが順番に出ます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/course/hajimete"
                className="rounded-xl bg-white text-indigo-900 px-5 py-3 text-sm font-bold hover:bg-indigo-50"
              >
                コースを生徒と同じ画面で見る
              </a>
              {site.contactUrl && (
                <a
                  href={site.contactUrl}
                  className="rounded-xl bg-indigo-500 text-white px-5 py-3 text-sm font-bold hover:bg-indigo-400"
                >
                  モニター教室について問い合わせる
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">1週間の流れ</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="p-3 font-bold">回</th>
                    <th className="p-3 font-bold">子どもの取り組み</th>
                    <th className="p-3 font-bold">先生がすること</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-bold whitespace-nowrap">1回目・2回目</td>
                    <td className="p-3">その週の音を聞く → 聞き分ける → 音と文字を合わせる</td>
                    <td className="p-3">コースのリンクを配る（初回のみ）</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold whitespace-nowrap">3回目</td>
                    <td className="p-3">6つの音の復習 → その文字でできる単語 → よく出ることば</td>
                    <td className="p-3">次の授業で、その週の音と単語を口頭で確認</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              4週目は、写真と音声で単語を覚え、ことばを並べて短い文を作るところまで進みます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">4週間の配信表（全{days.length}回）</h2>
            <div className="space-y-4">
              {course.weeks.map((week, wi) => (
                <div key={wi} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <h3 className="font-bold text-gray-900">{week.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">めあて：{week.goal}</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {days
                      .filter((d) => d.weekIndex === wi)
                      .map((d) => (
                        <li key={d.n}>
                          <span className="font-bold">第{d.n}回 {d.day.title}</span>
                          <span className="text-gray-500">
                            {" "}— {d.day.steps.map((s) => `${stepGameName(s)}（${s.minutes}分）`).join(" → ")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">パックに含まれるもの</h2>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
              {[
                ["子ども向け", "その日の3ステップが開く学習ページ（会員登録なし）"],
                ["先生向け", "4週間の配信表と、授業での口頭確認のポイント"],
                ["保護者向け", "使い方と声かけの説明 1枚"],
                ["導入", "初回の操作説明"],
              ].map(([k, v]) => (
                <li key={k} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="font-bold text-gray-900">{k}</p>
                  <p className="mt-1">{v}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-sm text-gray-700">
            <h2 className="text-lg font-bold text-gray-900 mb-2">いまの段階について</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>WISE English Club の教室で実際に使いながら改善している教材です。</li>
              <li>音声は端末の読み上げ機能を使うため、端末によって聞こえ方が変わります。</li>
              <li>教室ごとに生徒の学習状況をまとめて見る先生用の画面は、準備中です。</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
