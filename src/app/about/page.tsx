import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "使い方・データの扱い | WISE English Club",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-gray-900">使い方・データの扱い</h1>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">使い方</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>学習ホームで、目的に合うコースをえらびます。</li>
            <li>「今日の10分」に出ている3つを、上から順に「はじめる」。</li>
            <li>3つ終わったら、その日はおしまいです。次に開くと、つづきが出ます。</li>
          </ol>
          <p className="mt-3 text-sm">
            ゲームを自分でえらびたいときは、学習ホームの「ゲームを自分でえらぶ」から、対象・めやす時間・練習することを見てえらべます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">保護者の方へ</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>1回10分ほどで終わる量にしています。毎日でなくて大丈夫です。週3回がめやすです。</li>
            <li>音が出ます。はじめての回は、音が聞こえているか一緒に確認してください。</li>
            <li>声かけは「何点だった？」より「今日はどの音（ことば）をやったの？」がおすすめです。</li>
            <li>
              学習のようすは<a href="/parent" className="text-indigo-700 underline">保護者ページ</a>で確認できます。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">データの扱い</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>会員登録なしで使えます。氏名・メールアドレス・住所は集めていません。</li>
            <li>
              ゲームでは、表示名（ニックネーム）、遊んだゲーム、正解数・問題数・得点、まちがえた問題を、学習記録として保存します。
            </li>
            <li>表示名には、本名ではなくニックネームを使ってください。</li>
            <li>コースの ✓ のしるしは、お使いの端末の中だけに保存されます。</li>
            <li>記録は、学習状況の確認と教材の改善のために使います。広告には使いません。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">運営</h2>
          <p>{site.operator}</p>
          {site.contactUrl && (
            <p className="mt-1">
              <a href={site.contactUrl} className="text-indigo-700 underline">
                {site.contactLabel}
              </a>
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
