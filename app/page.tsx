import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseParts, courseStats } from "@/lib/course-data";
import { BookOpen, Code, Rocket, CheckCircle2, Clock, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section (two-column) */}
      <section className="container mx-auto px-4 py-16 md:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-8">
            <Badge variant="neutral" className="px-4 py-2 text-sm font-medium inline-block">
              🎉 100% Complete • 17 Chapters
            </Badge>

            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
              Learn React Native — build real apps
            </h1>

            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
              A hands-on course that takes you from zero to production-ready React Native developer. Follow the lessons, run the examples, and ship your first app.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button asChild size="lg" className="text-lg px-6 py-4">
                <Link href="/course/part1/what-is-react-native">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Chapter 1
                </Link>
              </Button>

              <Button asChild size="lg" variant="neutral" className="text-lg px-6 py-4">
                <Link href="/course">
                  <Layers className="mr-2 h-5 w-5" />
                  Browse All Chapters
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Code className="h-4 w-4 text-primary" />
                <span>95+ Code Examples</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Rocket className="h-4 w-4 text-primary" />
                <span>Production Patterns</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>~{courseStats.estimatedHours} Hours</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <div className="rounded-2xl border p-6 shadow-lg bg-gradient-to-b from-white/60 to-muted/5 dark:from-black/60">
              <h3 className="text-lg font-semibold">What's inside</h3>
              <p className="mt-2 text-sm text-muted-foreground">A quick tour of the course highlights.</p>

              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <Badge variant="neutral">Part 1</Badge>
                  <div>
                    <p className="text-sm font-medium">Foundations</p>
                    <p className="text-xs text-muted-foreground">Components, Styling, Interaction</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="neutral">Part 2</Badge>
                  <div>
                    <p className="text-sm font-medium">Core Concepts</p>
                    <p className="text-xs text-muted-foreground">State, Navigation, Context</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="neutral">Part 3</Badge>
                  <div>
                    <p className="text-sm font-medium">Advanced</p>
                    <p className="text-xs text-muted-foreground">Testing, Native APIs, Performance</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6">
                <Button asChild variant="neutral" className="w-full">
                  <Link href="/course">Explore the course</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {courseStats.totalChapters}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Chapters</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {courseStats.codeExamples}+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Code Examples</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                {courseStats.estimatedHours}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Hours Content</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">
                100%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Complete</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Course Parts */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Course Structure</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three comprehensive parts taking you from beginner to building production-ready apps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {courseParts.map((part) => (
              <Card key={part.id} className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="neutral">Part {part.number}</Badge>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle className="text-2xl">{part.title}</CardTitle>
                  <CardDescription className="text-base">
                    {part.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {part.chapters.slice(0, 3).map((chapter) => (
                      <div key={chapter.id} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground line-clamp-1">
                          {chapter.title}
                        </span>
                      </div>
                    ))}
                    {part.chapters.length > 3 && (
                      <p className="text-sm text-muted-foreground pl-6">
                        +{part.chapters.length - 3} more chapters
                      </p>
                    )}
                  </div>
                  
                  <Button asChild variant="neutral" className="w-full">
                    <Link href={`/course/part${part.number}/${part.chapters[0].slug}`}>
                      Start Part {part.number}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What You'll Learn</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Practical Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn by building real projects with detailed, line-by-line explanations. 
                  No assumptions about prior knowledge.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Rocket className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Production Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Master patterns used in real apps. Learn testing, performance optimization, 
                  and deployment to app stores.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Latest Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All code follows 2025 best practices with React 18+, React Native 0.74+, 
                  and modern tooling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-3xl md:text-4xl">Ready to Start Building?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of developers learning React Native from scratch
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/course/part1/what-is-react-native">
                <BookOpen className="mr-2 h-5 w-5" />
                Begin Chapter 1
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
