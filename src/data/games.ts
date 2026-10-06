export interface Game {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  url: string;
  icon: string;
  level: string;
  /** 1回の目安時間（分） */
  minutes: string;
  /** 練習する内容（ひとことで） */
  skill: string;
  /** home = 家庭でひとりで使える / class = 先生の進行が必要 */
  use: "home" | "class";
  tags: string[];
  color: string;
}

export interface Category {
  id: string;
  title: string;
  titleJa: string;
  icon: string;
  description: string;
  gradient: string;
  games: Game[];
}

const pink = "bg-pink-50 border-pink-200";
const blue = "bg-blue-50 border-blue-200";
const green = "bg-emerald-50 border-emerald-200";
const amber = "bg-amber-50 border-amber-200";

export const categories: Category[] = [
  {
    id: "phonics",
    title: "Phonics Island",
    titleJa: "音と文字",
    icon: "🌸",
    description: "英語の音と文字のつながりを、聞いて・見て・えらんで学ぶ",
    gradient: "from-pink-400 to-rose-500",
    games: [
      {
        id: "phonics",
        title: "Phonics Garden",
        titleJa: "フォニックス",
        description:
          "42の音を、音・ことば・おはなし・うごきで1つずつ学ぶ。8種類のミニゲームつき",
        url: "https://phonics-winniek75s-projects.vercel.app",
        icon: "🎵",
        level: "4〜7歳・はじめて",
        minutes: "5〜10",
        skill: "音を聞く・文字と結びつける",
        use: "home",
        tags: ["42の音", "ミニゲーム8種"],
        color: pink,
      },
      {
        id: "phonics-sounds",
        title: "Phonics Sounds",
        titleJa: "フォニックスサウンド",
        description:
          "英単語を聞いて「この音があるかな？」をYES／NOで答える聞き分け練習。時間制限なしの練習モードあり",
        url: "https://phonics-sounds-winniek75s-projects.vercel.app",
        icon: "🔊",
        level: "4〜8歳・はじめて",
        minutes: "2〜3",
        skill: "音の聞き分け（18音）",
        use: "home",
        tags: ["リスニング", "5〜10問"],
        color: pink,
      },
      {
        id: "phonics-battle",
        title: "First Words Battle",
        titleJa: "はじめての英単語バトル",
        description:
          "日本語と絵のヒントを見て、合う英単語を4つからえらぶ。ひとり練習・タイムチャレンジ・2人たいせん",
        url: "https://phonics-battle-winniek75s-projects.vercel.app",
        icon: "⚔️",
        level: "年長〜小学生",
        minutes: "2〜3",
        skill: "短い英単語の意味",
        use: "home",
        tags: ["4択", "2人対戦もOK"],
        color: pink,
      },
      {
        id: "sight-words",
        title: "Sight Words Memory",
        titleJa: "サイトワーズメモリー",
        description:
          "よく出る英単語のカードあわせ（神経衰弱）。めくると読み上げ、最後に聞き取り3問で確認。1〜4人",
        url: "https://sight-words-memory-winniek75s-projects.vercel.app",
        icon: "🧠",
        level: "年長〜小学生",
        minutes: "3〜5",
        skill: "よく出る単語を見て・聞いてわかる",
        use: "home",
        tags: ["ひとりでもOK", "親子・教室向き"],
        color: pink,
      },
    ],
  },
  {
    id: "vocabulary",
    title: "Vocabulary Arena",
    titleJa: "単語",
    icon: "📕",
    description: "覚える → 確かめる → 素早く答える、の順で単語を身につける",
    gradient: "from-blue-400 to-indigo-500",
    games: [
      {
        id: "flashinput",
        title: "Flash Input",
        titleJa: "フラッシュインプット",
        description:
          "写真 → 音声 → 意味 → 例文 → 思い出して答える。1ユニット6語を2周して覚える導入教材",
        url: "https://flashinput-winniek75s-projects.vercel.app",
        icon: "💡",
        level: "英検5〜4級（60語）",
        minutes: "4〜6",
        skill: "新しい単語を覚える",
        use: "home",
        tags: ["① 覚える", "写真と音声"],
        color: blue,
      },
      {
        id: "eiken-game",
        title: "Eiken Quest",
        titleJa: "英検クエスト",
        description:
          "英検5・4・3級の単語・文法・表現の4択クイズ。時間制限なしの「まなぶ」と10問の「かくにんテスト」",
        url: "https://eiken-game-winniek75s-projects.vercel.app",
        icon: "🎯",
        level: "英検5〜3級",
        minutes: "3〜5",
        skill: "覚えた単語を確かめる",
        use: "home",
        tags: ["② 確かめる", "4択10問"],
        color: blue,
      },
      {
        id: "falling-word",
        title: "Falling Word Battle",
        titleJa: "フォーリングワードバトル",
        description:
          "英単語を見て、落ちてくる日本語から正しい意味をタップ。はじめては1レーンの「やさしい」から",
        url: "https://fallingwordbattle-winniek75s-projects.vercel.app",
        icon: "⚡",
        level: "英検5〜2級",
        minutes: "1〜3",
        skill: "覚えた単語を素早く思い出す",
        use: "home",
        tags: ["③ 素早く答える", "復習向き"],
        color: blue,
      },
    ],
  },
  {
    id: "grammar",
    title: "Grammar Castle",
    titleJa: "文法",
    icon: "🏰",
    description: "単元をしぼって、解説つきで練習する",
    gradient: "from-emerald-400 to-teal-500",
    games: [
      {
        id: "aredo-game",
        title: "Am / Is / Are / Do / Does",
        titleJa: "Am・Is・Are・Do・Does クイズ",
        description:
          "疑問文の最初の1語をえらぶ。「うしろに何が来るか」で見分ける解説つき。3段階・全50問",
        url: "https://aredo-game-winniek75s-projects.vercel.app",
        icon: "❓",
        level: "小学校高学年〜中1",
        minutes: "3〜4",
        skill: "be動詞と一般動詞の疑問文",
        use: "home",
        tags: ["時間制限なし", "10問から"],
        color: green,
      },
      {
        id: "eiken-grammar",
        title: "Eiken Grade 3 Grammar",
        titleJa: "英検3級 文法マスター",
        description:
          "現在完了・過去形・受動態を単元ごとに練習。答えのあとに完成文と3ステップの解説",
        url: "https://eiken-grammar-game-winniek75s-projects.vercel.app",
        icon: "📗",
        level: "英検3級（中2〜3）",
        minutes: "3〜5",
        skill: "現在完了・過去形・受動態",
        use: "home",
        tags: ["単元をえらべる", "全100問"],
        color: green,
      },
      {
        id: "grammar-drill",
        title: "to / ing Drill",
        titleJa: "to / ing 使い分けドリル",
        description:
          "want to play か enjoy playing か。動詞のあとの形を選び、最後に自分で1文を完成させる",
        url: "https://grammar-drill-winniek75s-projects.vercel.app",
        icon: "✏️",
        level: "英検3級〜準2級",
        minutes: "5",
        skill: "不定詞と動名詞の使い分け",
        use: "home",
        tags: ["2択＋作文2問", "全94問"],
        color: green,
      },
      {
        id: "verbform-battle",
        title: "Relatives & Participles",
        titleJa: "関係詞＆分詞ドリル",
        description:
          "who / which / that / what と、-ing / -ed の分詞を穴うめで練習。導入レッスンつき",
        url: "https://verbform-battle-winniek75s-projects.vercel.app",
        icon: "🧩",
        level: "英検3級〜準2級",
        minutes: "3〜5",
        skill: "関係代名詞・分詞",
        use: "home",
        tags: ["時間制限なし", "全75問"],
        color: green,
      },
      {
        id: "grammar-app",
        title: "Grammar Lesson Room",
        titleJa: "先生と英文法レッスン",
        description:
          "先生がルームを作り、生徒はコードで入室。先生が出した問題に全員で答える授業用ツール（中1〜中3・300問）",
        url: "https://grammar-app-winniek75s-projects.vercel.app",
        icon: "👩‍🏫",
        level: "中1〜中3",
        minutes: "授業内",
        skill: "中学英文法の総復習",
        use: "class",
        tags: ["授業用", "先生の進行が必要"],
        color: green,
      },
    ],
  },
  {
    id: "reading-writing",
    title: "Reading & Writing Tower",
    titleJa: "読む・書く",
    icon: "📖",
    description: "覚えた単語と文法を、文章の中で使う",
    gradient: "from-amber-400 to-orange-500",
    games: [
      {
        id: "reading-dash",
        title: "Reading Dash",
        titleJa: "リーディングダッシュ",
        description:
          "短い英文を読んで、True／Falseと質問に答える。解説で本文の根拠を表示。「じっくり」と「速読」",
        url: "https://sentence-dash-winniek75s-projects.vercel.app",
        icon: "📖",
        level: "小学校高学年〜中学生",
        minutes: "3〜6",
        skill: "短い文章の読解",
        use: "home",
        tags: ["読解", "2文章から"],
        color: amber,
      },
      {
        id: "instant-english",
        title: "Instant English",
        titleJa: "瞬間英作文",
        description:
          "単語練習・並べかえ・英作文で「自分で英語を作る」練習。文型ヒントつきの「はじめて」レベルあり",
        url: "https://instant-english-app-winniek75s-projects.vercel.app",
        icon: "💬",
        level: "小学生〜中学生",
        minutes: "3〜10",
        skill: "英文を組み立てる",
        use: "home",
        tags: ["並べかえ", "英作文"],
        color: amber,
      },
    ],
  },
  {
    id: "eiken",
    title: "Eiken Trainer",
    titleJa: "英検対策",
    icon: "🎯",
    description: "英検4級・3級・準2級の単語と文法を、にがて優先で反復する",
    gradient: "from-violet-400 to-purple-500",
    games: [
      {
        id: "eiken-words",
        title: "Eiken Word Trainer",
        titleJa: "英検 単語トレーナー",
        description:
          "1セット6語を「見る・聞く → 意味をえらぶ → 例文に入れる」。ふくしゅうは、まちがえた語・しばらく見ていない語から先に出題",
        url: "/eiken",
        icon: "🗂️",
        level: "英検4級・3級・準2級（各144語）",
        minutes: "2〜4",
        skill: "級別の単語を覚えて、例文で使う",
        use: "home",
        tags: ["6語ずつ", "にがて優先"],
        color: "bg-violet-50 border-violet-200",
      },
      {
        id: "eiken-drill",
        title: "Eiken Grammar Drill",
        titleJa: "英検 文法ドリル",
        description:
          "ポイントを読んでから10問（えらぶ＋ならべかえ）。答えのあとに「なぜ？」の解説。まちがえた問題はその場でもう1回",
        url: "/eiken",
        icon: "🧱",
        level: "英検4級・3級・準2級（15単元・300問）",
        minutes: "4〜5",
        skill: "未来・助動詞・比較・完了形・分詞構文・仮定法 など",
        use: "home",
        tags: ["1回10問", "解説つき"],
        color: "bg-violet-50 border-violet-200",
      },
    ],
  },
];

export const allGames: Game[] = categories.flatMap((c) => c.games);

export function getGame(id: string): Game {
  const g = allGames.find((x) => x.id === id);
  if (!g) throw new Error(`unknown game: ${id}`);
  return g;
}

/** ゲームのURLに直接起動用のパス・パラメータを付ける */
export function gameLink(id: string, path = ""): string {
  return getGame(id).url + path;
}
