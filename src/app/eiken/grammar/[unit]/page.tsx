import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrammarDrill } from "@/components/eiken/GrammarDrill";
import { allUnitIds, getGrade, getUnit } from "@/data/eiken";

type Params = Promise<{ unit: string }>;

export function generateStaticParams() {
  return allUnitIds().map((unit) => ({ unit }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { unit } = await params;
  const u = getUnit(unit);
  return { title: u ? `${u.title} | WISE English Club` : "WISE English Club" };
}

export default async function Page({ params }: { params: Params }) {
  const { unit } = await params;
  const u = getUnit(unit);
  const g = u && getGrade(u.grade);
  if (!u || !g) notFound();
  return <GrammarDrill unit={u} grade={g} />;
}
