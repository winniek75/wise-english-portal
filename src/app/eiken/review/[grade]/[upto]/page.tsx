import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WordReview } from "@/components/eiken/WordReview";
import { getGrade, grades, SETS_PER_GRADE, wordsUpTo } from "@/data/eiken";

type Params = Promise<{ grade: string; upto: string }>;

export function generateStaticParams() {
  return grades.flatMap((g) =>
    Array.from({ length: SETS_PER_GRADE }, (_, i) => ({ grade: g.key, upto: String(i + 1) }))
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { grade } = await params;
  const g = getGrade(grade);
  return { title: g ? `${g.label} 単語ふくしゅう | WISE English Club` : "WISE English Club" };
}

export default async function Page({ params }: { params: Params }) {
  const { grade, upto } = await params;
  const g = getGrade(grade);
  const n = Number(upto);
  if (!g || !Number.isInteger(n) || n < 1 || n > SETS_PER_GRADE) notFound();
  return <WordReview grade={g} upto={n} words={wordsUpTo(g.key, n)} />;
}
