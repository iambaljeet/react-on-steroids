"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Home } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { MobileSidebar } from "./mobile-sidebar";

export function CourseHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isCoursePage = pathname?.startsWith("/course");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-white/60 to-transparent dark:from-black/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          {isCoursePage && <MobileSidebar />}

          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src="/logo.svg" alt="React Native Course" width={36} height={36} className="anim-float rounded-md" />
            <span className="font-extrabold text-lg tracking-tight ml-1">React Native Course</span>
          </Link>
        </div>

        <nav className="hidden md:flex ml-8 items-center gap-4 flex-1">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            Home
          </Link>
          <Link href="/course" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            Course
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
            About
          </Link>
          <a href="https://github.com/iambaljeet/react-on-steroids" target="_blank" rel="noreferrer" className="ml-4 text-sm text-muted-foreground hover:opacity-90">
            GitHub
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            {isCoursePage && (
              <Button asChild variant="neutral" size="sm" className="hidden lg:inline-flex">
                <Link href="/"> 
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            )}

            <Button asChild size="sm" variant="neutral" className="hidden lg:inline-flex">
              <Link href="/course">Start Learning</Link>
            </Button>
          </div>

          {mounted && (
            <Button
              variant="neutral"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
