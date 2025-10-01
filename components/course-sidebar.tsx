"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { courseParts } from "@/lib/course-data";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";

function SidebarContent() {
  const pathname = usePathname();
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [openParts, setOpenParts] = useState<string[]>([]);

  useEffect(() => {
    // Load completed chapters from localStorage
    const loadCompleted = () => {
      const saved = localStorage.getItem("completedChapters");
      if (saved) {
        setCompletedChapters(new Set(JSON.parse(saved)));
      }
    };

    loadCompleted();

    // Listen for changes
    window.addEventListener("storage", loadCompleted);

    // Auto-open the current part
    if (pathname) {
      const match = pathname.match(/\/course\/part(\d+)/);
      if (match) {
        setOpenParts([`part${match[1]}`]);
      }
    }

    return () => {
      window.removeEventListener("storage", loadCompleted);
    };
  }, [pathname]);

  const isChapterCompleted = (chapterId: string) => {
    return completedChapters.has(chapterId);
  };

  const isChapterActive = (slug: string) => {
    return pathname?.includes(slug);
  };

  return (
    <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Course Contents</h2>
            <p className="text-sm text-muted-foreground">
              {completedChapters.size} / 17 chapters completed
            </p>
          </div>

          <Accordion type="multiple" value={openParts} onValueChange={setOpenParts}>
            {courseParts.map((part) => {
              const completedCount = part.chapters.filter((ch) =>
                isChapterCompleted(ch.id)
              ).length;

              return (
                <AccordionItem key={part.id} value={part.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Part {part.number}</span>
                        <Badge variant="neutral" className="text-xs">
                          {completedCount}/{part.chapters.length}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 pl-2">
                      {part.chapters.map((chapter) => {
                        const isActive = isChapterActive(chapter.slug);
                        const isCompleted = isChapterCompleted(chapter.id);

                        return (
                          <Link
                            key={chapter.id}
                            href={`/course/part${part.number}/${chapter.slug}`}
                            className={cn(
                              "flex items-start gap-2 p-2 rounded-lg text-sm transition-colors group",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                                  Ch {chapter.number}
                                </span>
                                {chapter.isNew && (
                                  <Badge className="text-xs px-1.5 py-0">NEW</Badge>
                                )}
                              </div>
                              <p className="line-clamp-2 leading-tight mt-0.5">
                                {chapter.title}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
    </div>
  );
}

export function CourseSidebar() {
  return (
    <aside className="w-80 border-r bg-muted/10 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full">
        <SidebarContent />
      </ScrollArea>
    </aside>
  );
}

export function MobileSidebarContent() {
  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <SidebarContent />
      </ScrollArea>
    </div>
  );
}
