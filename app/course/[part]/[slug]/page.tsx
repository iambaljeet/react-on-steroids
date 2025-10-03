import { notFound } from "next/navigation";
import { ChapterContent } from "@/components/chapter-content";
import { getAllChapters, getChapterBySlug } from "@/lib/course-data";
import fs from "fs/promises";
import path from "path";

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
  const chapter = getChapterBySlug(slug);
  
  if (!chapter) {
    notFound();
  }
  
  // Read markdown content at build time
  let content = "";
  try {
    const filePath = path.join(process.cwd(), "public", chapter.path);
    content = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading chapter file:", error);
    notFound();
  }
  
  return <ChapterContent slug={slug} initialContent={content} />;
}
