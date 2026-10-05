// 英検対策 12週間コース（1回約10分 × 週3回）。授業用の「英検対策プラン」の週次表に合わせてある。
import type { Course, Day, Step, Week } from "../courses";
import { GradeKey, grades, mixId, wordSets } from "./index";

const s = (gameId: string, role: Step["role"], label: string, minutes: number, path: string): Step => ({
  gameId,
  role,
  label,
  minutes,
  path,
});

const drill = (unitId: string, label: string): Step =>
  s("eiken-drill", "たしかめる", `${label} 10問`, 4, `/grammar/${unitId}`);

interface WeekPlan {
  title: string;
  goal: string;
  /** 1日目・2日目の文法ステップ */
  grammar: [Step, Step];
  /** 3日目の「つかう」ステップ */
  use: Step;
}

const read = (level: "medium" | "hard") =>
  s("reading-dash", "つかう", "短い文章をじっくり読む 2文章", 4, `/?level=${level}&mode=careful&count=2`);
const build = (level: "starter" | "beginner") =>
  s("instant-english", "つかう", "ことばをならべて文をつくる 5問", 4, `/?mode=shuffle&level=${level}&count=5`);
const idiom = (grade: 4 | 3) =>
  s("eiken-game", "つかう", `${grade}級の熟語をまなぶ`, 4, `/?grade=${grade}&mode=idiom`);

const plans: Record<GradeKey, WeekPlan[]> = {
  "4": [
    {
      title: "過去形①",
      goal: "be動詞と規則動詞の過去形を使い分ける",
      grammar: [
        s("eiken-grammar", "たしかめる", "過去形 10問（解説つき）", 4, "/?unit=past&count=10"),
        s("eiken-grammar", "たしかめる", "過去形 もう10問", 4, "/?unit=past&count=10"),
      ],
      use: build("beginner"),
    },
    {
      title: "過去形②（不規則動詞・疑問文）",
      goal: "不規則動詞と、過去の疑問文・否定文に慣れる",
      grammar: [
        s("eiken-grammar", "たしかめる", "過去形 10問（解説つき）", 4, "/?unit=past&count=10"),
        s("aredo-game", "たしかめる", "疑問文の最初の1語 10問", 4, "/?level=does&count=10"),
      ],
      use: read("medium"),
    },
    {
      title: "未来の文",
      goal: "be going to と will で、これからのことを言う",
      grammar: [drill("g4-future", "未来の文"), drill("g4-future", "未来の文 もういちど")],
      use: build("beginner"),
    },
    {
      title: "助動詞",
      goal: "can / must / have to / may / should を使い分ける",
      grammar: [drill("g4-modals", "助動詞"), drill("g4-modals", "助動詞 もういちど")],
      use: idiom(4),
    },
    {
      title: "不定詞と動名詞",
      goal: "want to ～ と enjoy ～ing の形をえらべる",
      grammar: [
        s("grammar-drill", "たしかめる", "to / ing 基礎 10問", 4, "/?mode=basic&count=10"),
        s("grammar-drill", "たしかめる", "to / ing もう10問", 4, "/?mode=basic&count=10"),
      ],
      use: build("beginner"),
    },
    {
      title: "比較",
      goal: "-er / -est、more / most、as ... as でくらべる",
      grammar: [drill("g4-comparison", "比較"), drill("g4-comparison", "比較 もういちど")],
      use: read("medium"),
    },
    {
      title: "There is / are と接続詞",
      goal: "「〜がある」と、when / because / if でつなぐ文",
      grammar: [drill("g4-there-conj", "There is・接続詞"), drill("g4-there-conj", "There is・接続詞 もういちど")],
      use: idiom(4),
    },
    {
      title: "過去進行形と give / show",
      goal: "was / were ～ing と「人に物を〜する」の語順",
      grammar: [
        drill("g4-pastprog-svoo", "過去進行形・give / show"),
        drill("g4-pastprog-svoo", "過去進行形・give / show もういちど"),
      ],
      use: read("medium"),
    },
  ],
  "3": [
    {
      title: "現在完了①（継続・経験）",
      goal: "have + 過去分詞の形と、for / since を使う",
      grammar: [
        s("eiken-grammar", "たしかめる", "現在完了 10問（解説つき）", 4, "/?unit=pp&count=10"),
        s("eiken-grammar", "たしかめる", "現在完了 もう10問", 4, "/?unit=pp&count=10"),
      ],
      use: read("medium"),
    },
    {
      title: "現在完了②と過去形",
      goal: "現在完了と過去形を、時を表す語で見分ける",
      grammar: [
        s("eiken-grammar", "たしかめる", "現在完了 10問", 4, "/?unit=pp&count=10"),
        s("eiken-grammar", "たしかめる", "過去形 10問", 4, "/?unit=past&count=10"),
      ],
      use: idiom(3),
    },
    {
      title: "受動態",
      goal: "be動詞 + 過去分詞で「〜される」を言う",
      grammar: [
        s("eiken-grammar", "たしかめる", "受動態 10問（解説つき）", 4, "/?unit=passive&count=10"),
        s("eiken-grammar", "たしかめる", "受動態 もう10問", 4, "/?unit=passive&count=10"),
      ],
      use: read("hard"),
    },
    {
      title: "不定詞の応用",
      goal: "It is ... to ～、how to ～、want 人 to ～ を使う",
      grammar: [drill("g3-infinitive", "不定詞の応用"), drill("g3-infinitive", "不定詞の応用 もういちど")],
      use: s("grammar-drill", "つかう", "to / ing 意味が変わる動詞 8問", 4, "/?mode=both&count=8"),
    },
    {
      title: "関係代名詞",
      goal: "who / which / that で名詞を説明する",
      grammar: [
        s("verbform-battle", "たしかめる", "関係代名詞 who 8問", 4, "/?unit=who&count=8"),
        s("verbform-battle", "たしかめる", "関係代名詞 which / that 8問", 4, "/?unit=which&count=8"),
      ],
      use: read("hard"),
    },
    {
      title: "分詞と間接疑問文",
      goal: "-ing / -ed で名詞を説明する。疑問詞のあとの語順",
      grammar: [
        s("verbform-battle", "たしかめる", "分詞（-ing / -ed）8問", 4, "/?unit=participle&count=8"),
        drill("g3-indirect", "間接疑問文"),
      ],
      use: idiom(3),
    },
    {
      title: "比較のまとめと接続詞",
      goal: "as ... as、最上級の言いかえ、接続詞のあとの形",
      grammar: [drill("g3-comp-conj", "比較・接続詞"), drill("g3-comp-conj", "比較・接続詞 もういちど")],
      use: read("hard"),
    },
    {
      title: "総復習",
      goal: "これまでの文法をまぜて確かめる",
      grammar: [
        s("eiken-grammar", "ふくしゅう", "現在完了・過去形・受動態 まぜこぜ10問", 4, "/?unit=mix&count=10"),
        s("eiken-drill", "ふくしゅう", "文法まぜこぜ 10問（にがて優先）", 4, `/grammar/${mixId("3")}`),
      ],
      use: s("verbform-battle", "ふくしゅう", "関係詞＆分詞 3級 10問", 4, "/?level=grade3&count=10"),
    },
  ],
  p2: [
    {
      title: "完了形の整理",
      goal: "現在完了・現在完了進行形・過去完了を使い分ける",
      grammar: [drill("p2-perfect", "完了形"), drill("p2-perfect", "完了形 もういちど")],
      use: read("hard"),
    },
    {
      title: "助動詞 + have + 過去分詞・受動態の応用",
      goal: "must have / should have の意味と、いろいろな受動態",
      grammar: [
        drill("p2-modal-perfect", "助動詞+have・受動態"),
        drill("p2-modal-perfect", "助動詞+have・受動態 もういちど"),
      ],
      use: s("eiken-grammar", "ふくしゅう", "受動態 10問（3級の復習）", 4, "/?unit=passive&count=10"),
    },
    {
      title: "使役・知覚動詞と不定詞 / 動名詞",
      goal: "make / let / have 人 + 原形、動詞のあとの to と -ing",
      grammar: [
        drill("p2-causative", "使役・知覚・to / ing"),
        s("grammar-drill", "たしかめる", "to / ing 意味が変わる動詞 8問", 4, "/?mode=both&count=8"),
      ],
      use: read("hard"),
    },
    {
      title: "分詞と分詞構文",
      goal: "「する側」は -ing、「される側」は過去分詞",
      grammar: [drill("p2-participle", "分詞構文"), drill("p2-participle", "分詞構文 もういちど")],
      use: s("verbform-battle", "つかう", "分詞構文・with + 分詞 8問", 4, "/?unit=kobun,with&count=8"),
    },
    {
      title: "関係代名詞 what と関係副詞",
      goal: "what / whose / where / when / why を使い分ける",
      grammar: [
        drill("p2-relative", "what・関係副詞"),
        s("verbform-battle", "たしかめる", "what・whose・where・when 10問", 4, "/?unit=what,whose,where,when&count=10"),
      ],
      use: read("hard"),
    },
    {
      title: "仮定法",
      goal: "If I were ...、I wish ... で「もし〜なら」を言う",
      grammar: [drill("p2-subjunctive", "仮定法"), drill("p2-subjunctive", "仮定法 もういちど")],
      use: s("verbform-battle", "ふくしゅう", "関係詞＆分詞 準2級 10問", 4, "/?level=pre2&count=10"),
    },
    {
      title: "比較の慣用表現とつなぎ言葉",
      goal: "however / therefore など、文と文のつながりを読む",
      grammar: [drill("p2-connectors", "比較・つなぎ言葉"), drill("p2-connectors", "比較・つなぎ言葉 もういちど")],
      use: read("hard"),
    },
    {
      title: "総復習",
      goal: "これまでの文法をまぜて確かめる",
      grammar: [
        s("eiken-drill", "ふくしゅう", "文法まぜこぜ 10問（にがて優先）", 4, `/grammar/${mixId("p2")}`),
        s("eiken-drill", "ふくしゅう", "文法まぜこぜ もう10問", 4, `/grammar/${mixId("p2")}`),
      ],
      use: s("verbform-battle", "ふくしゅう", "関係詞＆分詞 準2級 10問", 4, "/?level=pre2&count=10"),
    },
  ],
};

const meta: Record<GradeKey, { icon: string; audience: string; finish: Step[] }> = {
  "4": {
    icon: "🥉",
    audience: "英検4級をめざす小学校高学年〜中学2年生",
    finish: [
      s("eiken-game", "たしかめる", "4級 かくにんテスト 10問", 4, "/?grade=4&mode=normal&count=10"),
      read("medium"),
      idiom(4),
    ],
  },
  "3": {
    icon: "🥈",
    audience: "英検3級をめざす中学生",
    finish: [
      s("eiken-game", "たしかめる", "3級 かくにんテスト 10問", 4, "/?grade=3&mode=normal&count=10"),
      read("hard"),
      idiom(3),
    ],
  },
  p2: {
    icon: "🥇",
    audience: "英検準2級をめざす中学3年生〜高校生",
    finish: [
      read("hard"),
      s("verbform-battle", "ふくしゅう", "関係詞＆分詞 準2級 10問", 4, "/?level=pre2&count=10"),
      s("grammar-drill", "ふくしゅう", "to / ing 意味が変わる動詞 8問", 4, "/?mode=both&count=8"),
    ],
  },
};

function buildCourse(grade: GradeKey): Course {
  const info = grades.find((g) => g.key === grade)!;
  const sets = wordSets(grade);
  const learn = (n: number): Step =>
    s("eiken-words", "おぼえる", `単語セット${n}「${sets[n - 1].theme}」6語`, 4, `/words/${grade}/${n}`);
  const review = (upto: number, label?: string): Step =>
    s(
      "eiken-words",
      "ふくしゅう",
      label ?? (upto === 1 ? "今日の6語をもういちど" : `これまでの単語 12問（セット1〜${upto}）`),
      2,
      `/review/${grade}/${upto}`
    );

  const weeks: Week[] = plans[grade].map((p, wi) => {
    const first = wi * 3 + 1;
    const days: Day[] = [
      { title: `単語セット${first}＋文法`, steps: [learn(first), p.grammar[0], review(first)] },
      { title: `単語セット${first + 1}＋文法`, steps: [learn(first + 1), p.grammar[1], review(first + 1)] },
      { title: `単語セット${first + 2}＋つかう`, steps: [learn(first + 2), p.use, review(first + 2)] },
    ];
    return { title: `${wi + 1}週目：${p.title}`, goal: p.goal, days };
  });

  const mix = (label = "文法まぜこぜ 10問（にがて優先）"): Step =>
    s("eiken-drill", "ふくしゅう", label, 4, `/grammar/${mixId(grade)}`);
  const all = sets.length;
  const fin = meta[grade].finish;
  const range = [8, 16, all];
  for (let w = 9; w <= 12; w++) {
    weeks.push({
      title: `${w}週目：仕上げ${w === 12 ? "（本番前）" : ""}`,
      goal:
        w === 12
          ? "にがてな単語と文法をなくして、本番へ"
          : "過去問の解き直しを優先。ここでは単語と文法のにがてをつぶす",
      days: [0, 1, 2].map((d) => {
        const upto = w === 9 ? range[d] : all;
        return {
          title: `にがてつぶし ${d + 1}`,
          steps: [
            review(upto, `単語ふくしゅう 12問（セット1〜${upto}・にがて優先）`),
            mix(),
            fin[(w + d) % fin.length],
          ],
        };
      }),
    });
  }

  return {
    id: info.courseId,
    icon: meta[grade].icon,
    title: `${info.label}対策 12週間`,
    subtitle: "単語144語と文法を、1回10分ずつ反復する",
    audience: meta[grade].audience,
    outcome: `${info.label}の頻出単語144語を覚え、文法の単元を1つずつ確かめる。9週目からはにがてつぶし`,
    rhythm: "1回 約10分 × 週3回 × 12週間（全36回）",
    gradient: info.gradient,
    weeks,
  };
}

export const eikenCourses: Course[] = grades.map((g) => buildCourse(g.key));
