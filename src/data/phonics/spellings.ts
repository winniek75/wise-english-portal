/**
 * Jolly Phonics 同音異綴（alternative spellings）
 * 同じ音を表す複数の綴りを、グループごとにまとめたデータ。
 * pattern に "_" が入るものは split digraph（a_e など：母音 + 子音 + e）。
 */
export interface SpellingWord {
  word: string;
  pattern: string;
  /** 絵のヒント（絵文字） */
  pic: string;
}

export interface SpellingGroup {
  id: string;
  label: string;
  sound: string;
  spellings: string[];
  words: SpellingWord[];
}

const w = (word: string, pattern: string, pic: string): SpellingWord => ({ word, pattern, pic });

export const spellingGroups: SpellingGroup[] = [
  {
    id: "ai",
    label: "ai / ay / a_e",
    sound: "/ai/",
    spellings: ["ai", "ay", "a_e"],
    words: [
      w("rain", "ai", "🌧️"), w("train", "ai", "🚆"), w("snail", "ai", "🐌"), w("paint", "ai", "🎨"), w("tail", "ai", "🐒"),
      w("mail", "ai", "📬"), w("nail", "ai", "🔨"), w("chain", "ai", "⛓️"), w("brain", "ai", "🧠"), w("wait", "ai", "⏳"),
      w("play", "ay", "⚽"), w("day", "ay", "☀️"), w("tray", "ay", "🍽️"), w("hay", "ay", "🌾"), w("spray", "ay", "💦"),
      w("stay", "ay", "🏠"), w("clay", "ay", "🏺"), w("pray", "ay", "🙏"), w("gray", "ay", "🩶"), w("ray", "ay", "☀️"),
      w("cake", "a_e", "🎂"), w("gate", "a_e", "🚪"), w("plane", "a_e", "✈️"), w("grape", "a_e", "🍇"), w("snake", "a_e", "🐍"),
      w("lake", "a_e", "🏞️"), w("wave", "a_e", "🌊"), w("flame", "a_e", "🔥"), w("name", "a_e", "📛"), w("plate", "a_e", "🍽️"),
    ],
  },
  {
    id: "ee",
    label: "ee / ea / e_e",
    sound: "/ee/",
    spellings: ["ee", "ea", "e_e"],
    words: [
      w("tree", "ee", "🌳"), w("bee", "ee", "🐝"), w("sheep", "ee", "🐑"), w("feet", "ee", "🦶"), w("green", "ee", "🟩"),
      w("seed", "ee", "🌱"), w("teeth", "ee", "🦷"), w("week", "ee", "📅"), w("cheese", "ee", "🧀"), w("queen", "ee", "👸"),
      w("leaf", "ea", "🍃"), w("seal", "ea", "🦭"), w("beach", "ea", "🏖️"), w("peach", "ea", "🍑"), w("meat", "ea", "🥩"),
      w("bean", "ea", "🫘"), w("cream", "ea", "🍦"), w("dream", "ea", "💭"), w("team", "ea", "🤝"), w("read", "ea", "📖"),
      w("these", "e_e", "👉"), w("theme", "e_e", "🎪"), w("eve", "e_e", "🌙"), w("scene", "e_e", "🎬"),
      w("Pete", "e_e", "👦"), w("Steve", "e_e", "🧑"), w("here", "e_e", "📍"), w("compete", "e_e", "🏆"), w("delete", "e_e", "🗑️"),
      w("complete", "e_e", "✅"),
    ],
  },
  {
    id: "ie",
    label: "ie / igh / y / i_e",
    sound: "/ie/",
    spellings: ["ie", "igh", "y", "i_e"],
    words: [
      w("pie", "ie", "🥧"), w("tie", "ie", "👔"), w("lie", "ie", "🛌"), w("die", "ie", "🎲"),
      w("fries", "ie", "🍟"), w("dried", "ie", "🌵"), w("cried", "ie", "😢"),
      w("light", "igh", "💡"), w("night", "igh", "🌃"), w("high", "igh", "🏔️"), w("bright", "igh", "✨"), w("fight", "igh", "🥊"),
      w("right", "igh", "➡️"), w("sight", "igh", "👀"), w("tight", "igh", "🤏"),
      w("fly", "y", "🪰"), w("sky", "y", "🌌"), w("cry", "y", "😭"), w("dry", "y", "🏜️"), w("spy", "y", "🕵️"),
      w("shy", "y", "😳"), w("try", "y", "💪"), w("fry", "y", "🍳"),
      w("bike", "i_e", "🚲"), w("kite", "i_e", "🪁"), w("five", "i_e", "5️⃣"), w("slide", "i_e", "🛝"), w("smile", "i_e", "😊"),
      w("rice", "i_e", "🍚"), w("wine", "i_e", "🍷"),
    ],
  },
  {
    id: "oa",
    label: "oa / ow / o_e",
    sound: "/oa/",
    spellings: ["oa", "ow", "o_e"],
    words: [
      w("boat", "oa", "⛵"), w("goat", "oa", "🐐"), w("soap", "oa", "🧼"), w("coat", "oa", "🧥"), w("road", "oa", "🛣️"),
      w("toast", "oa", "🍞"), w("toad", "oa", "🐸"), w("oak", "oa", "🌳"), w("foam", "oa", "🫧"), w("roast", "oa", "🍗"),
      w("snow", "ow", "❄️"), w("bow", "ow", "🎀"), w("yellow", "ow", "🟨"), w("window", "ow", "🪟"), w("grow", "ow", "🌱"),
      w("flow", "ow", "🌊"), w("throw", "ow", "🤾"), w("pillow", "ow", "🛏️"), w("elbow", "ow", "💪"), w("follow", "ow", "🚶"),
      w("home", "o_e", "🏠"), w("bone", "o_e", "🦴"), w("rope", "o_e", "🪢"), w("nose", "o_e", "👃"), w("stone", "o_e", "🪨"),
      w("hole", "o_e", "🕳️"), w("rose", "o_e", "🌹"), w("stove", "o_e", "🔥"), w("smoke", "o_e", "💨"), w("globe", "o_e", "🌍"),
    ],
  },
  {
    id: "ue",
    label: "ue / ew / u_e",
    sound: "/ue/",
    spellings: ["ue", "ew", "u_e"],
    words: [
      w("blue", "ue", "🟦"), w("glue", "ue", "🧴"), w("clue", "ue", "🔍"), w("rescue", "ue", "🚒"),
      w("true", "ue", "✅"), w("value", "ue", "💎"), w("statue", "ue", "🗽"), w("tissue", "ue", "🤧"), w("argue", "ue", "🗣️"), w("continue", "ue", "▶️"),
      w("new", "ew", "🆕"), w("few", "ew", "🤏"), w("stew", "ew", "🍲"), w("chew", "ew", "🍬"), w("screw", "ew", "🔩"),
      w("blew", "ew", "🌬️"), w("drew", "ew", "✏️"), w("flew", "ew", "✈️"), w("grew", "ew", "🌱"), w("threw", "ew", "🤾"),
      w("cube", "u_e", "🧊"), w("tube", "u_e", "🧪"), w("flute", "u_e", "🎶"), w("huge", "u_e", "🐘"), w("mule", "u_e", "🫏"),
      w("rude", "u_e", "😤"), w("June", "u_e", "📅"), w("prune", "u_e", "🟣"), w("rule", "u_e", "📏"), w("cute", "u_e", "🐱"),
    ],
  },
  {
    id: "oi",
    label: "oi / oy",
    sound: "/oi/",
    spellings: ["oi", "oy"],
    words: [
      w("coin", "oi", "🪙"), w("oil", "oi", "🛢️"), w("boil", "oi", "♨️"), w("point", "oi", "👉"), w("soil", "oi", "🌱"), w("noise", "oi", "📢"),
      w("join", "oi", "🤝"), w("foil", "oi", "🫕"), w("coil", "oi", "🌀"), w("moist", "oi", "💧"), w("voice", "oi", "🎤"), w("choice", "oi", "🤔"),
      w("toilet", "oi", "🚽"), w("poison", "oi", "☠️"), w("avoid", "oi", "🚫"),
      w("boy", "oy", "👦"), w("toy", "oy", "🧸"), w("joy", "oy", "😄"), w("enjoy", "oy", "🎉"), w("cowboy", "oy", "🤠"), w("royal", "oy", "👑"),
      w("destroy", "oy", "💥"), w("annoy", "oy", "😠"), w("employ", "oy", "💼"), w("loyal", "oy", "🫡"), w("voyage", "oy", "🚢"),
      w("oyster", "oy", "🦪"), w("ploy", "oy", "🎭"), w("decoy", "oy", "🦆"), w("ahoy", "oy", "⚓"),
    ],
  },
  {
    id: "ou",
    label: "ou / ow",
    sound: "/ou/",
    spellings: ["ou", "ow"],
    words: [
      w("cloud", "ou", "☁️"), w("mouse", "ou", "🐭"), w("house", "ou", "🏠"), w("loud", "ou", "📣"), w("round", "ou", "⭕"), w("shout", "ou", "🗣️"),
      w("mouth", "ou", "👄"), w("south", "ou", "🧭"), w("count", "ou", "🔢"), w("found", "ou", "🔎"), w("ground", "ou", "🌍"), w("sound", "ou", "🔊"),
      w("proud", "ou", "🦁"), w("bounce", "ou", "🏀"), w("pound", "ou", "💷"),
      w("cow", "ow", "🐄"), w("owl", "ow", "🦉"), w("town", "ow", "🏘️"), w("crown", "ow", "👑"), w("clown", "ow", "🤡"), w("brown", "ow", "🟫"),
      w("flower", "ow", "🌸"), w("tower", "ow", "🗼"), w("power", "ow", "⚡"), w("shower", "ow", "🚿"), w("frown", "ow", "😠"),
      w("howl", "ow", "🐺"), w("growl", "ow", "🐻"), w("towel", "ow", "🛁"), w("down", "ow", "⬇️"),
    ],
  },
  {
    id: "er",
    label: "er / ir / ur",
    sound: "/er/",
    spellings: ["er", "ir", "ur"],
    words: [
      w("her", "er", "👩"), w("fern", "er", "🌿"), w("under", "er", "⬇️"), w("river", "er", "🏞️"), w("winter", "er", "⛄"),
      w("tiger", "er", "🐯"), w("water", "er", "💧"), w("sister", "er", "👩‍👧"), w("flower", "er", "🌺"), w("hammer", "er", "🔨"),
      w("bird", "ir", "🐦"), w("girl", "ir", "👧"), w("shirt", "ir", "👕"), w("dirt", "ir", "🪱"), w("first", "ir", "🥇"),
      w("third", "ir", "🥉"), w("stir", "ir", "🥄"), w("skirt", "ir", "👗"), w("circle", "ir", "⭕"), w("birthday", "ir", "🎂"),
      w("hurt", "ur", "🤕"), w("turn", "ur", "↩️"), w("nurse", "ur", "👩‍⚕️"), w("purple", "ur", "🟪"), w("burger", "ur", "🍔"),
      w("church", "ur", "⛪"), w("surf", "ur", "🏄"), w("turtle", "ur", "🐢"), w("burn", "ur", "🔥"), w("fur", "ur", "🐻"),
    ],
  },
  {
    id: "or",
    label: "or / au / aw / al",
    sound: "/or/",
    spellings: ["or", "au", "aw", "al"],
    words: [
      w("fork", "or", "🍴"), w("corn", "or", "🌽"), w("horse", "or", "🐴"), w("storm", "or", "⛈️"), w("sport", "or", "🏅"),
      w("short", "or", "📏"), w("north", "or", "🧭"), w("port", "or", "🚢"),
      w("sauce", "au", "🥫"), w("haunt", "au", "👻"), w("August", "au", "📅"), w("launch", "au", "🚀"), w("autumn", "au", "🍂"),
      w("cause", "au", "⚖️"), w("pause", "au", "⏸️"), w("fault", "au", "❌"),
      w("saw", "aw", "🪚"), w("paw", "aw", "🐾"), w("draw", "aw", "✏️"), w("straw", "aw", "🥤"), w("yawn", "aw", "🥱"),
      w("claw", "aw", "🦞"), w("jaw", "aw", "🦈"), w("lawn", "aw", "🏡"),
      w("walk", "al", "🚶"), w("talk", "al", "💬"), w("ball", "al", "🏀"), w("salt", "al", "🧂"), w("small", "al", "🐜"),
      w("wall", "al", "🧱"),
    ],
  },
];

/** 表示用：a_e → a-e */
export const displayPattern = (p: string) => p.replace("_", "-");

/** 単語を [前, 母音部, 中の子音, e, 後] に分ける（split digraph 対応） */
export function splitWord(word: string, pattern: string): [string, string, string, string, string] {
  const lower = word.toLowerCase();
  if (pattern.includes("_")) {
    const v = pattern[0];
    const m = lower.match(new RegExp(`${v}([^aeiou])e`));
    if (m && m.index !== undefined) {
      const i = m.index;
      return [lower.slice(0, i), v, m[1], "e", lower.slice(i + 3)];
    }
  }
  const i = lower.indexOf(pattern);
  if (i < 0) return [lower, "", "", "", ""];
  return [lower.slice(0, i), pattern, "", "", lower.slice(i + pattern.length)];
}
