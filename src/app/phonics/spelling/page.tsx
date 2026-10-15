import type { Metadata } from "next";
import { SpellingDojo } from "@/components/phonics/SpellingDojo";

export const metadata: Metadata = {
  title: "Spelling Dojo 同音異綴れんしゅう | WISE English Club",
  description:
    "Jolly Phonics の同じ音・ちがう綴り（ai/ay/a_e など9グループ）を、絵と音声で「えらぶ」「しわけ」の2モードで練習。",
};

export default function Page() {
  return <SpellingDojo />;
}
