# WISE English Club 学習ホーム（ポータル）

- `/` 目的別コースの入口 ＋ ゲーム一覧（対象・めやす時間・練習すること）
- `/course/[id]` 「今日の10分」コース（`src/data/courses.ts` で定義。各ステップはゲームの直接起動URL）
- `/parent` 保護者ページ（6桁コード）
- `/teachers` 外部の英語教室向け案内（4週間パック）
- `/eiken` 英検対策トレーナー（4級・3級・準2級）。単語 `/eiken/words/[級]/[セット]`、単語ふくしゅう `/eiken/review/[級]/[セットまで]`、文法ドリル `/eiken/grammar/[単元]`
- `/about` 使い方・データの扱い

## よく変える場所

| 変えたいこと | ファイル |
|---|---|
| ゲームの名前・説明・対象・めやす時間 | `src/data/games.ts` |
| コースの内容（週・回・ステップ） | `src/data/courses.ts` |
| 問い合わせ先・運営者名 | `src/data/site.ts` |

## docs

- `docs/supabase-parent-access.sql` 保護者ページのアクセス制御（DB側）
- `docs/4week-pack-teacher-guide.md` 4週間パック 先生用ガイド
- `docs/4week-pack-parent-letter.md` 保護者向け説明1枚

## 開発

```bash
npm install
npm run dev
```

## 英検対策トレーナー

- 単語（各級144語＝6語×24セット）と文法ドリル（15単元×20問）の中身は `src/data/eiken/json/*.json`。文言の修正はこのJSONだけで済む。
- 12週間コース（`/course/eiken-g4` `eiken-g3` `eiken-p2`）の週ごとの割り当ては `src/data/eiken/plan.ts`。
- 正解・不正解は端末の localStorage（`wise_eiken_stats_v1`）にだけ保存し、にがて優先の出題に使う。保護者ページの学習記録には送っていない。
