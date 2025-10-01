import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CustomCursor } from "@/components/custom-cursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React Native Course - From Zero to Production",
  description: "A comprehensive, hands-on React Native course designed for developers with NO React Native experience. Learn by building real projects with 18 chapters of detailed content.",
  keywords: ["React Native", "Mobile Development", "iOS", "Android", "React", "JavaScript", "TypeScript", "Tutorial", "Course"],
  authors: [{ name: "React Native Course" }],
  openGraph: {
    title: "React Native Course - From Zero to Production",
    description: "Master React Native from scratch with 18 comprehensive chapters and 95+ code examples",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased cursor-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
