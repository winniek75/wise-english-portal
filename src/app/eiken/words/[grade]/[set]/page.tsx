import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WordTrainer } from "@/components/eiken/WordTrainer";
import { getGrade, grades, SETS_PER_GRADE, wordSets } from "@/data/eiken";

type Params = Promise<{ grade: string; set: string }>;

export function generateStaticParams() {
  return grades.flatMap((g) =>
    Array.from({ length: SETS_PER_GRADE }, (_, i) => ({ grade: g.key, set: String(i + 1) }))
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { grade, set } = await params;
  const g = getGrade(grade);
  return { title: g ? `${g.label} 単語 セット${set} | WISE English Club` : "WISE English Club" };
}

export default async function Page({ params }: { params: Params }) {
  const { grade, set } = await params;
  const g = getGrade(grade);
  if (!g) notFound();
  const sets = wordSets(g.key);
  const current = sets.find((s) => String(s.n) === set);
  if (!current) notFound();
  return <WordTrainer grade={g} set={current} pool={sets.flatMap((s) => s.words)} />;
}
