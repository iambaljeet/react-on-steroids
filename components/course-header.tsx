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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex items-center space-x-2">
          {isCoursePage && <MobileSidebar />}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="font-bold text-xl">React Native Course</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {isCoursePage && (
              <Button asChild variant="neutral" size="sm" className="hidden sm:flex">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            )}
            
            {mounted && (
              <Button
                variant="neutral"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
