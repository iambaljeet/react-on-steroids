"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle2, BookmarkPlus } from "lucide-react";
import { getChapterBySlug, getNextChapter, getPreviousChapter } from "@/lib/course-data";
import { Skeleton } from "@/components/ui/skeleton";
import "highlight.js/styles/github-dark.css";

interface ChapterContentProps {
  slug: string;
}

export function ChapterContent({ slug }: ChapterContentProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const chapter = getChapterBySlug(slug);
  const nextChapter = getNextChapter(slug);
  const previousChapter = getPreviousChapter(slug);

  useEffect(() => {
    if (!chapter) return;

    // Load chapter content
    fetch(chapter.path)
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading chapter:", err);
        setLoading(false);
      });

    // Check if chapter is completed
    const saved = localStorage.getItem("completedChapters");
    if (saved) {
      const completed = new Set(JSON.parse(saved));
      setIsCompleted(completed.has(chapter.id));
    }
  }, [chapter]);

  const toggleCompleted = () => {
    if (!chapter) return;

    const saved = localStorage.getItem("completedChapters");
    const completed = saved ? new Set(JSON.parse(saved)) : new Set();

    if (isCompleted) {
      completed.delete(chapter.id);
    } else {
      completed.add(chapter.id);
    }

    localStorage.setItem("completedChapters", JSON.stringify([...completed]));
    setIsCompleted(!isCompleted);
    window.dispatchEvent(new Event("storage"));
  };

  if (!chapter) {
    return (
      <div className="container max-w-4xl mx-auto p-6 md:p-10">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Chapter Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The chapter you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/course">Back to Course</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-6 md:p-10 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-3 pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 md:p-10">
      {/* Chapter Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">Chapter {chapter.number}</Badge>
          {chapter.isNew && <Badge>NEW</Badge>}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {chapter.title}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant={isCompleted ? "default" : "neutral"}
            size="sm"
            onClick={toggleCompleted}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </Button>
        </div>
      </div>

      {/* Markdown Content */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />
            ),
            h4: ({ ...props }) => (
              <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="mb-4 leading-7 text-foreground" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="leading-7" {...props} />
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children, ...props }) => {
              const [copied, setCopied] = React.useState(false);
              
              const handleCopy = () => {
                const codeElement = (children as any)?.props?.children;
                const code = typeof codeElement === 'string' ? codeElement : '';
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              };

              return (
                <div className="relative group my-4">
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-2 p-2 rounded-lg bg-background/80 border hover:bg-background transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                  <pre
                    className="bg-muted border rounded-lg p-4 overflow-x-auto"
                    {...props}
                  >
                    {children}
                  </pre>
                </div>
              );
            },
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                {...props}
              />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-border" {...props} />
              </div>
            ),
            th: ({ ...props }) => (
              <th className="px-4 py-2 bg-muted font-semibold text-left" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="px-4 py-2 border-t" {...props} />
            ),
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                className="text-primary hover:underline font-medium"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Navigation */}
      <div className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between gap-4">
          {previousChapter ? (
            <Button asChild variant="neutral" className="flex-1">
              <Link href={`/course/part${previousChapter.number <= 6 ? 1 : previousChapter.number <= 12 ? 2 : 3}/${previousChapter.slug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <div className="text-left flex-1">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium line-clamp-1">{previousChapter.title}</div>
                </div>
              </Link>
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {nextChapter ? (
            <Button asChild className="flex-1">
              <Link href={`/course/part${nextChapter.number <= 6 ? 1 : nextChapter.number <= 12 ? 2 : 3}/${nextChapter.slug}`}>
                <div className="text-right flex-1">
                  <div className="text-xs">Next</div>
                  <div className="font-medium line-clamp-1">{nextChapter.title}</div>
                </div>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </div>
  );
}
