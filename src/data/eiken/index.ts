// 英検対策トレーナーのデータ（単語・文法）。問題の中身は ./json/*.json にある。
import wordsG4 from "./json/words-g4.json";
import wordsG3 from "./json/words-g3.json";
import wordsP2 from "./json/words-p2.json";
import g4Future from "./json/grammar-g4-future.json";
import g4Modals from "./json/grammar-g4-modals.json";
import g4Comparison from "./json/grammar-g4-comparison.json";
import g4ThereConj from "./json/grammar-g4-there-conj.json";
import g4PastprogSvoo from "./json/grammar-g4-pastprog-svoo.json";
import g3Infinitive from "./json/grammar-g3-infinitive.json";
import g3Indirect from "./json/grammar-g3-indirect.json";
import g3CompConj from "./json/grammar-g3-comp-conj.json";
import p2Perfect from "./json/grammar-p2-perfect.json";
import p2ModalPerfect from "./json/grammar-p2-modal-perfect.json";
import p2Causative from "./json/grammar-p2-causative.json";
import p2Participle from "./json/grammar-p2-participle.json";
import p2Relative from "./json/grammar-p2-relative.json";
import p2Subjunctive from "./json/grammar-p2-subjunctive.json";
import p2Connectors from "./json/grammar-p2-connectors.json";

export type GradeKey = "4" | "3" | "p2";

export interface GradeInfo {
  key: GradeKey;
  label: string;
  courseId: string;
  level: string;
  gradient: string;
}

export const grades: GradeInfo[] = [
  { key: "4", label: "英検4級", courseId: "eiken-g4", level: "中学2年ていど", gradient: "from-sky-500 to-blue-600" },
  { key: "3", label: "英検3級", courseId: "eiken-g3", level: "中学卒業ていど", gradient: "from-violet-500 to-purple-600" },
  { key: "p2", label: "英検準2級", courseId: "eiken-p2", level: "高校中級ていど", gradient: "from-orange-500 to-rose-500" },
];

export function getGrade(key: string): GradeInfo | undefined {
  return grades.find((g) => g.key === key);
}

export const SETS_PER_GRADE = 50;

export interface Word {
  /** 学習記録のキー */
  id: string;
  en: string;
  ja: string;
  pos: string;
  ex: string;
  exJa: string;
  set: number;
}

export interface WordSet {
  n: number;
  theme: string;
  words: Word[];
}

interface RawWords {
  grade: string;
  sets: { n: number; theme: string; words: Omit<Word, "id" | "set">[] }[];
}

const rawWords: Record<GradeKey, RawWords> = { "4": wordsG4, "3": wordsG3, p2: wordsP2 };

export function wordSets(grade: GradeKey): WordSet[] {
  return rawWords[grade].sets.map((s) => ({
    n: s.n,
    theme: s.theme,
    words: s.words.map((w) => ({ ...w, id: `w:${grade}:${w.en}`, set: s.n })),
  }));
}

export function wordsUpTo(grade: GradeKey, upto: number): Word[] {
  return wordSets(grade)
    .filter((s) => s.n <= upto)
    .flatMap((s) => s.words);
}

export interface ChoiceQuestion {
  id: string;
  type: "choice";
  q: string;
  ja: string;
  options: string[];
  answer: number;
  why: string;
}

export interface OrderQuestion {
  id: string;
  type: "order";
  ja: string;
  words: string[];
  full: string;
  why: string;
}

export type Question = ChoiceQuestion | OrderQuestion;

export interface GrammarUnit {
  id: string;
  grade: GradeKey;
  title: string;
  points: string[];
  examples: { en: string; ja: string }[];
  questions: Question[];
}

const units = [
  g4Future,
  g4Modals,
  g4Comparison,
  g4ThereConj,
  g4PastprogSvoo,
  g3Infinitive,
  g3Indirect,
  g3CompConj,
  p2Perfect,
  p2ModalPerfect,
  p2Causative,
  p2Participle,
  p2Relative,
  p2Subjunctive,
  p2Connectors,
] as unknown as GrammarUnit[];

export const grammarUnits: GrammarUnit[] = units;

export function unitsOf(grade: GradeKey): GrammarUnit[] {
  return grammarUnits.filter((u) => u.grade === grade);
}

/** 級ごとの「まぜこぜ」単元（その級の新しいドリル全部から出題） */
export const mixId = (grade: GradeKey) => `${grade === "p2" ? "p2" : `g${grade}`}-mix`;

export function getUnit(id: string): GrammarUnit | undefined {
  const found = grammarUnits.find((u) => u.id === id);
  if (found) return found;
  const grade = grades.find((g) => mixId(g.key) === id);
  if (!grade) return undefined;
  return {
    id,
    grade: grade.key,
    title: `${grade.label} 文法まぜこぜ`,
    points: [],
    examples: [],
    questions: unitsOf(grade.key).flatMap((u) => u.questions),
  };
}

export const allUnitIds = (): string[] => [
  ...grammarUnits.map((u) => u.id),
  ...grades.map((g) => mixId(g.key)),
];
