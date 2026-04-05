export interface Game {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  url: string;
  icon: string;
  level: string;
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

export const categories: Category[] = [
  {
    id: "phonics",
    title: "Phonics Island",
    titleJa: "フォニックス",
    icon: "🌸",
    description: "英語の音と文字の関係を楽しく学ぼう！",
    gradient: "from-pink-400 to-rose-500",
    games: [
      {
        id: "phonics",
        title: "Jolly Phonics",
        titleJa: "ジョリーフォニックス",
        description:
          "42音素・72トリッキーワードを8種類のゲームで学べる総合フォニックスアプリ",
        url: "https://phonics-winniek75s-projects.vercel.app",
        icon: "🎵",
        level: "4〜7歳",
        tags: ["フォニックス", "42音素", "ゲーム8種"],
        color: "bg-pink-50 border-pink-200",
      },
      {
        id: "phonics-battle",
        title: "Phonics Battle",
        titleJa: "フォニックスバトル",
        description: "フォニックスの知識を使って対戦形式で学ぶゲーム",
        url: "https://phonics-battle-winniek75s-projects.vercel.app",
        icon: "⚔️",
        level: "5〜8歳",
        tags: ["バトル", "対戦"],
        color: "bg-pink-50 border-pink-200",
      },
      {
        id: "phonics-sounds",
        title: "Phonics Sounds",
        titleJa: "フォニックスサウンド",
        description: "フォニックスの発音をリスニングで練習",
        url: "https://phonics-sounds-winniek75s-projects.vercel.app",
        icon: "🔊",
        level: "4〜7歳",
        tags: ["リスニング", "発音"],
        color: "bg-pink-50 border-pink-200",
      },
      {
        id: "sight-words",
        title: "Sight Words Memory",
        titleJa: "サイトワーズメモリー",
        description: "サイトワーズを神経衰弱ゲームで覚えよう",
        url: "https://sight-words-memory-winniek75s-projects.vercel.app",
        icon: "🧠",
        level: "4〜8歳",
        tags: ["サイトワーズ", "記憶ゲーム"],
        color: "bg-pink-50 border-pink-200",
      },
    ],
  },
  {
    id: "vocabulary",
    title: "Vocabulary Arena",
    titleJa: "語彙・単語",
    icon: "⚔️",
    description: "英検レベル別に単語力を鍛えよう！",
    gradient: "from-blue-400 to-indigo-500",
    games: [
      {
        id: "eiken-game",
        title: "Eiken Quest",
        titleJa: "英検クエスト",
        description:
          "英検5〜2級の語彙を落ちてくる単語ゲームで練習。XPランキング付き",
        url: "https://eiken-game-winniek75s-projects.vercel.app",
        icon: "📕",
        level: "英検5〜2級",
        tags: ["英検", "語彙", "ランキング"],
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "falling-word",
        title: "Falling Word Battle",
        titleJa: "フォーリングワードバトル",
        description:
          "画面上から落ちてくる英単語の正しい日本語訳を素早く選ぼう",
        url: "https://fallingwordbattle-winniek75s-projects.vercel.app",
        icon: "⚡",
        level: "英検5〜2級",
        tags: ["スピード", "反射神経"],
        color: "bg-blue-50 border-blue-200",
      },
      {
        id: "flashinput",
        title: "Flash Input",
        titleJa: "フラッシュインプット",
        description: "瞬間的に表示される単語を素早く入力して覚える",
        url: "https://flashinput-winniek75s-projects.vercel.app",
        icon: "💡",
        level: "小学〜中学",
        tags: ["タイピング", "瞬間記憶"],
        color: "bg-blue-50 border-blue-200",
      },
    ],
  },
  {
    id: "grammar",
    title: "Grammar Castle",
    titleJa: "文法",
    icon: "🏰",
    description: "英文法をゲームで楽しくマスターしよう！",
    gradient: "from-emerald-400 to-teal-500",
    games: [
      {
        id: "grammar-drill",
        title: "Grammar Drill",
        titleJa: "グラマードリル",
        description: "文法問題を繰り返し練習して定着させるドリル形式アプリ",
        url: "https://grammar-drill-winniek75s-projects.vercel.app",
        icon: "✏️",
        level: "中学生",
        tags: ["文法", "ドリル"],
        color: "bg-emerald-50 border-emerald-200",
      },
      {
        id: "grammar-app",
        title: "Grammar App",
        titleJa: "グラマーアプリ",
        description: "文法項目別に学べる総合文法学習アプリ",
        url: "https://grammar-app-winniek75s-projects.vercel.app",
        icon: "📚",
        level: "中学生",
        tags: ["文法", "項目別"],
        color: "bg-emerald-50 border-emerald-200",
      },
      {
        id: "eiken-grammar",
        title: "Eiken Grammar",
        titleJa: "英検文法",
        description: "英検3級以上の文法問題を集中的に練習",
        url: "https://eiken-grammar-game-winniek75s-projects.vercel.app",
        icon: "🎯",
        level: "英検3級〜",
        tags: ["英検", "文法"],
        color: "bg-emerald-50 border-emerald-200",
      },
      {
        id: "aredo-game",
        title: "Are / Do Quiz",
        titleJa: "Are/Do クイズ",
        description:
          "AreとDoの使い分けを100問のクイズで完璧にマスター",
        url: "https://aredo-game-winniek75s-projects.vercel.app",
        icon: "❓",
        level: "小学〜中学",
        tags: ["be動詞", "一般動詞"],
        color: "bg-emerald-50 border-emerald-200",
      },
      {
        id: "verbform-battle",
        title: "Verb Form Battle",
        titleJa: "動詞変化バトル",
        description: "動詞の活用形をバトル形式で練習",
        url: "https://verbform-battle-winniek75s-projects.vercel.app",
        icon: "🗡️",
        level: "中学生",
        tags: ["動詞", "活用"],
        color: "bg-emerald-50 border-emerald-200",
      },
    ],
  },
  {
    id: "writing",
    title: "Writing Tower",
    titleJa: "英作文",
    icon: "💬",
    description: "英語で文章を作る力を身につけよう！",
    gradient: "from-amber-400 to-orange-500",
    games: [
      {
        id: "instant-english",
        title: "Instant English",
        titleJa: "瞬間英作文",
        description:
          "AI採点付き！90語のレベル別単語、英作文、シャッフル翻訳の3モードで英語の瞬発力を鍛える",
        url: "https://instant-english-app-winniek75s-projects.vercel.app",
        icon: "🤖",
        level: "中学生",
        tags: ["AI採点", "3レベル", "英作文", "音声入力"],
        color: "bg-amber-50 border-amber-200",
      },
      {
        id: "sentence-dash",
        title: "Sentence Dash",
        titleJa: "センテンスダッシュ",
        description: "120問の3レーン落下カードゲーム。コンボ＆復習システムで文法を体で覚える",
        url: "https://sentence-dash-winniek75s-projects.vercel.app",
        icon: "🏃",
        level: "中学生",
        tags: ["カードゲーム", "コンボ", "復習システム"],
        color: "bg-amber-50 border-amber-200",
      },
    ],
  },
];
