import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoursePlayer } from "@/components/CoursePlayer";
import { courses, getCourse } from "@/data/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = getCourse(id);
  return { title: course ? `${course.title} | WISE English Club` : "WISE English Club" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) notFound();

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <section className={`bg-gradient-to-br ${course.gradient} text-white`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <a href="/" className="text-sm text-white/80 hover:text-white">
              ← 学習ホーム
            </a>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold">
              {course.icon} {course.title}
            </h1>
            <p className="mt-2 text-lg text-white/90">{course.subtitle}</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
              <div className="rounded-xl bg-white/15 p-3">
                <dt className="text-white/70 text-xs">対象</dt>
                <dd className="font-medium">{course.audience}</dd>
              </div>
              <div className="rounded-xl bg-white/15 p-3">
                <dt className="text-white/70 text-xs">ペース</dt>
                <dd className="font-medium">{course.rhythm}</dd>
              </div>
              <div className="rounded-xl bg-white/15 p-3">
                <dt className="text-white/70 text-xs">めざすこと</dt>
                <dd className="font-medium">{course.outcome}</dd>
              </div>
            </dl>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <CoursePlayer course={course} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
