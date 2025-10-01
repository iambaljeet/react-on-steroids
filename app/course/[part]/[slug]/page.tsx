import { notFound } from "next/navigation";
import { ChapterContent } from "@/components/chapter-content";
import { getAllChapters } from "@/lib/course-data";

export async function generateStaticParams() {
  const chapters = getAllChapters();
  
  return chapters.map((chapter) => {
    // Extract part number from the chapter
    const partNumber = chapter.number <= 6 ? 1 : chapter.number <= 12 ? 2 : 3;
    return {
      part: `part${partNumber}`,
      slug: chapter.slug,
    };
  });
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ part: string; slug: string }>;
}) {
  const { part, slug } = await params;
  
  return <ChapterContent slug={slug} />;
}
