import { gameLink, getGame } from "./games";

export interface Step {
  gameId: string;
  /** 子どもに見せる行動のことば */
  label: string;
  minutes: number;
  /** ゲームURLに足すパス・パラメータ（直接起動） */
  path: string;
  /** 3ステップの役割 */
  role: "おぼえる" | "たしかめる" | "つかう" | "ふくしゅう";
}

export interface Day {
  title: string;
  steps: Step[];
}

export interface Week {
  title: string;
  goal: string;
  days: Day[];
}

export interface Course {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  audience: string;
  outcome: string;
  rhythm: string;
  gradient: string;
  weeks: Week[];
}

const s = (
  gameId: string,
  role: Step["role"],
  label: string,
  minutes: number,
  path: string
): Step => ({ gameId, role, label, minutes, path });

/** フォニックス1グループ分（6音）の1週間 */
function phonicsWeek(
  n: number,
  group: number,
  a: string[],
  b: string[],
  sightSet: string,
  sightName: string
): Week {
  const all = [...a, ...b];
  return {
    title: `${n}週目：${all.join("・")} の音`,
    goal: `${all.join(" ")} の6つの音を聞き分けて、文字と結びつける`,
    days: [
      {
        title: `${a.join("・")} の音`,
        steps: [
          s("phonics", "おぼえる", `${a.join("・")} の音を聞く（音→ことばの順にタップ）`, 4, `/?group=${group}`),
          s("phonics-sounds", "たしかめる", `${a.join("・")} の音があるかな？ 10問`, 3, `/?letters=${a.join(",")}&mode=practice&count=10`),
          s("phonics", "つかう", "音と文字をあわせるゲーム", 3, `/games/letter-match?group=${group}`),
        ],
      },
      {
        title: `${b.join("・")} の音`,
        steps: [
          s("phonics", "おぼえる", `${b.join("・")} の音を聞く（音→ことばの順にタップ）`, 4, `/?group=${group}`),
          s("phonics-sounds", "たしかめる", `${b.join("・")} の音があるかな？ 10問`, 3, `/?letters=${b.join(",")}&mode=practice&count=10`),
          s("phonics", "つかう", "音を聞いてバブルをタップ", 3, `/games/bubble-pop?group=${group}`),
        ],
      },
      {
        title: "6つの音のふくしゅう",
        steps: [
          s("phonics-sounds", "ふくしゅう", "今週の6つの音 10問", 3, `/?letters=${all.join(",")}&mode=practice&count=10`),
          s("phonics-battle", "つかう", "今週の文字でできる英単語 10問（時間制限なし）", 3, `/?stage=${group}&mode=practice&count=10`),
          s("sight-words", "おぼえる", `よく出ることば（${sightName}）カードあわせ`, 4, `/?players=1&pairs=4&set=${sightSet}`),
        ],
      },
    ],
  };
}

const vocabDay = (unit: number): Day => ({
  title: `ユニット${unit}（6語）`,
  steps: [
    s("flashinput", "おぼえる", `写真と音声で6語をおぼえる`, 5, `/?unit=5-${unit}`),
    s("eiken-game", "たしかめる", "おぼえた6語の4択クイズ", 3, `/?unit=5-${unit}`),
    s("falling-word", "つかう", "おぼえた6語で落下ゲーム", 2, `/?unit=5-${unit}`),
  ],
});

export const courses: Course[] = [
  {
    id: "hajimete",
    icon: "🌱",
    title: "はじめての英語 4週間",
    subtitle: "音と文字から、はじめての単語と文へ",
    audience: "英語を習いはじめた小学生（年長〜小4くらい）",
    outcome: "18の音を聞き分け、短い英単語を読んで意味がわかる。4週目には短い文にふれる",
    rhythm: "1回 約10分 × 週3回 × 4週間（全12回）",
    gradient: "from-pink-500 to-rose-500",
    weeks: [
      phonicsWeek(1, 1, ["s", "a", "t"], ["i", "p", "n"], "pronouns", "I / you など"),
      phonicsWeek(2, 2, ["ck", "e", "h"], ["r", "m", "d"], "numbers", "かず"),
      phonicsWeek(3, 3, ["g", "o", "u"], ["l", "f", "b"], "people", "ひと"),
      {
        title: "4週目：ことばと文へ",
        goal: "写真と音声で単語を覚え、短い文の形にふれる",
        days: [
          {
            title: "はじめての単語",
            steps: [
              s("flashinput", "おぼえる", "写真と音声で6語をおぼえる", 5, "/?unit=5-1"),
              s("eiken-game", "たしかめる", "おぼえた6語の4択クイズ", 3, "/?unit=5-1"),
              s("falling-word", "つかう", "おぼえた6語で落下ゲーム", 2, "/?unit=5-1"),
            ],
          },
          {
            title: "はじめての文",
            steps: [
              s("flashinput", "おぼえる", "写真と音声で6語をおぼえる", 5, "/?unit=5-2"),
              s("aredo-game", "たしかめる", "Am・Is・Are をえらぶ 5問", 2, "/?level=be&count=5"),
              s("instant-english", "つかう", "ことばをならべて文をつくる 5問", 3, "/?mode=shuffle&level=starter&count=5"),
            ],
          },
          {
            title: "4週間のまとめ",
            steps: [
              s("phonics-sounds", "ふくしゅう", "これまでの音 10問", 3, "/?letters=s,a,t,e,h,m,g,o,b&mode=practice&count=10"),
              s("phonics-battle", "ふくしゅう", "1週目の英単語にもういちど 10問", 3, "/?stage=1&mode=practice&count=10"),
              s("sight-words", "ふくしゅう", "よく出ることば 8ペアにちょうせん", 4, "/?players=1&pairs=8&set=pronouns,numbers"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "eiken5",
    icon: "📕",
    title: "英検5級の単語 30語",
    subtitle: "覚える → 確かめる → 素早く答える",
    audience: "英検5級をめざす小学生・中学1年生",
    outcome: "5級の基本30語を、見て・聞いて意味がわかり、すぐ答えられる",
    rhythm: "1回 約10分 × 全6回",
    gradient: "from-blue-500 to-indigo-500",
    weeks: [
      {
        title: "前半：ユニット1〜3",
        goal: "18語をおぼえる",
        days: [vocabDay(1), vocabDay(2), vocabDay(3)],
      },
      {
        title: "後半：ユニット4〜5とかくにん",
        goal: "のこり12語をおぼえて、10問テストで確かめる",
        days: [
          vocabDay(4),
          vocabDay(5),
          {
            title: "かくにんテスト",
            steps: [
              s("eiken-game", "たしかめる", "5級かくにんテスト 10問", 3, "/?grade=5&mode=normal&count=10"),
              s("falling-word", "つかう", "やさしいモードで10語", 2, "/?grade=5&mode=easy&count=10"),
              s("aredo-game", "つかう", "Am・Is・Are をえらぶ 10問", 4, "/?level=be&count=10"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chugaku-grammar",
    icon: "🏰",
    title: "中学文法の復習 2週間",
    subtitle: "つまずきやすい単元を、解説つきで1つずつ",
    audience: "中学生・英検3級をめざす人",
    outcome: "be動詞／一般動詞、過去形、現在完了、受動態、to と ing、関係代名詞を単元ごとに確認する",
    rhythm: "1回 約10分 × 週3回 × 2週間（全6回）",
    gradient: "from-emerald-500 to-teal-500",
    weeks: [
      {
        title: "1週目：動詞の形",
        goal: "疑問文の作り方と、過去・現在完了・受動態を見分ける",
        days: [
          {
            title: "be動詞と一般動詞",
            steps: [
              s("aredo-game", "たしかめる", "Am・Is・Are 10問", 3, "/?level=be&count=10"),
              s("aredo-game", "たしかめる", "Do・Does もまぜて 10問", 4, "/?level=does&count=10"),
              s("instant-english", "つかう", "ことばをならべて文をつくる 5問", 3, "/?mode=shuffle&level=beginner&count=5"),
            ],
          },
          {
            title: "過去形",
            steps: [
              s("eiken-grammar", "たしかめる", "過去形 10問（解説つき）", 5, "/?unit=past&count=10"),
              s("reading-dash", "つかう", "過去の文章をじっくり読む 2文章", 5, "/?level=medium&mode=careful&count=2"),
            ],
          },
          {
            title: "現在完了と受動態",
            steps: [
              s("eiken-grammar", "たしかめる", "現在完了 10問", 5, "/?unit=pp&count=10"),
              s("eiken-grammar", "たしかめる", "受動態 10問", 5, "/?unit=passive&count=10"),
            ],
          },
        ],
      },
      {
        title: "2週目：文をつなぐ・ひろげる",
        goal: "to と ing の使い分け、関係代名詞を確認して、文章の中で読む",
        days: [
          {
            title: "to と ing",
            steps: [
              s("grammar-drill", "たしかめる", "to / ing 基礎 10問＋作文2問", 5, "/?mode=basic&count=10"),
              s("grammar-drill", "つかう", "意味が変わる動詞 8問", 5, "/?mode=both&count=8"),
            ],
          },
          {
            title: "関係代名詞",
            steps: [
              s("verbform-battle", "おぼえる", "導入レッスンを読む", 5, "/?level=grade3&mode=lesson"),
              s("verbform-battle", "たしかめる", "who の問題 5問", 3, "/?unit=who&count=5"),
              s("verbform-battle", "たしかめる", "which の問題 5問", 3, "/?unit=which&count=5"),
            ],
          },
          {
            title: "まとめ",
            steps: [
              s("eiken-grammar", "ふくしゅう", "3単元まぜこぜ 10問", 4, "/?unit=mix&count=10"),
              s("verbform-battle", "ふくしゅう", "関係詞＆分詞 3級 10問", 4, "/?level=grade3&count=10"),
              s("reading-dash", "つかう", "長めの文章をじっくり読む 2文章", 4, "/?level=hard&mode=careful&count=2"),
            ],
          },
        ],
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function stepUrl(step: Step): string {
  return gameLink(step.gameId, step.path);
}

export function stepGameName(step: Step): string {
  return getGame(step.gameId).titleJa;
}

/** コース内の全「日」を通し番号つきで並べる */
export function flatDays(course: Course) {
  const out: { week: Week; weekIndex: number; day: Day; dayIndex: number; n: number }[] = [];
  let n = 0;
  course.weeks.forEach((week, weekIndex) =>
    week.days.forEach((day, dayIndex) => {
      n += 1;
      out.push({ week, weekIndex, day, dayIndex, n });
    })
  );
  return out;
}

export const stepKey = (n: number, i: number) => `${n}-${i}`;
