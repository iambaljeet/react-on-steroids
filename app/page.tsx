import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseParts, courseStats } from "@/lib/course-data";
import { BookOpen, Code, Rocket, CheckCircle2, Clock, Layers, Sparkles, Target, Trophy } from "lucide-react";
import { ScrollReveal, Parallax, ScaleReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";
import { FloatingElements } from "@/components/floating-elements";
import { ScrollProgress } from "@/components/scroll-progress";
import { MagneticButton } from "@/components/magnetic-button";
import { Typewriter } from "@/components/typewriter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ScrollProgress />
      {/* Hero Section - Apple Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <FloatingElements />
        
        <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center space-y-6">
                <Badge variant="neutral" className="px-4 py-2 text-sm font-medium inline-block backdrop-blur-sm">
                  <Sparkles className="inline-block w-4 h-4 mr-2" />
                  100% Complete • 17 Chapters
                </Badge>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  <Typewriter text="Learn React Native" delay={500} speed={80} />
                </h1>
                
                <Parallax offset={30}>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground/90">
                    <Typewriter text="Build real apps." delay={2000} speed={80} />
                  </h2>
                </Parallax>

                <p className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  A hands-on course that takes you from zero to production-ready React Native developer. 
                  Follow the lessons, run the examples, and ship your first app.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
                <MagneticButton>
                  <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                    <Link href="/course/part1/what-is-react-native">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Start Chapter 1
                    </Link>
                  </Button>
                </MagneticButton>

                <MagneticButton>
                  <Button asChild size="lg" variant="neutral" className="text-lg px-8 py-6 rounded-full backdrop-blur-sm">
                    <Link href="/course">
                      <Layers className="mr-2 h-5 w-5" />
                      Browse All Chapters
                    </Link>
                  </Button>
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.6}>
              <div className="mt-16 flex flex-wrap justify-center gap-8">
                <div className="inline-flex items-center gap-3 text-base text-muted-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <span>95+ Code Examples</span>
                </div>
                <div className="inline-flex items-center gap-3 text-base text-muted-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <span>Production Patterns</span>
                </div>
                <div className="inline-flex items-center gap-3 text-base text-muted-foreground">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <span>~{courseStats.estimatedHours} Hours</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      </section>

      {/* Stats Section with Scale Animation */}
      <section className="container mx-auto px-4 py-24">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <StaggerItem>
            <ScaleReveal>
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-primary/20 bg-gradient-to-b from-card to-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    {courseStats.totalChapters}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-muted-foreground">Chapters</p>
                </CardContent>
              </Card>
            </ScaleReveal>
          </StaggerItem>
          
          <StaggerItem>
            <ScaleReveal delay={0.1}>
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-primary/20 bg-gradient-to-b from-card to-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    {courseStats.codeExamples}+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-muted-foreground">Code Examples</p>
                </CardContent>
              </Card>
            </ScaleReveal>
          </StaggerItem>
          
          <StaggerItem>
            <ScaleReveal delay={0.2}>
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-primary/20 bg-gradient-to-b from-card to-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">
                    {courseStats.estimatedHours}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-muted-foreground">Hours Content</p>
                </CardContent>
              </Card>
            </ScaleReveal>
          </StaggerItem>
          
          <StaggerItem>
            <ScaleReveal delay={0.3}>
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-primary/20 bg-gradient-to-b from-card to-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                    100%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-muted-foreground">Complete</p>
                </CardContent>
              </Card>
            </ScaleReveal>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Course Parts with Parallax */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <ScrollReveal direction="up">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Course Structure
              </h2>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
                Three comprehensive parts taking you from beginner to building production-ready apps
              </p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8 mt-16">
            {courseParts.map((part, index) => (
              <StaggerItem key={part.id}>
                <Parallax offset={20 * (index + 1)}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 bg-gradient-to-b from-card to-card/50 group hover:scale-105">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="neutral" className="text-sm px-3 py-1">Part {part.number}</Badge>
                        <div className="p-2 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-2">{part.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {part.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {part.chapters.slice(0, 3).map((chapter) => (
                          <div key={chapter.id} className="flex items-start gap-3 text-sm group/item">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                            <span className="text-muted-foreground line-clamp-1 group-hover/item:text-foreground transition-colors">
                              {chapter.title}
                            </span>
                          </div>
                        ))}
                        {part.chapters.length > 3 && (
                          <p className="text-sm text-muted-foreground pl-7">
                            +{part.chapters.length - 3} more chapters
                          </p>
                        )}
                      </div>
                      
                      <Button asChild variant="neutral" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Link href={`/course/part${part.number}/${part.chapters[0].slug}`}>
                          Start Part {part.number}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </Parallax>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features with Stagger Animation */}
      <section className="container mx-auto px-4 py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-6xl font-bold">What You'll Learn</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Master modern React Native development with hands-on, production-ready techniques
              </p>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 bg-gradient-to-b from-card to-card/50 group hover:scale-105">
                <CardHeader>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Code className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-2xl">Practical Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Learn by building real projects with detailed, line-by-line explanations. 
                    No assumptions about prior knowledge.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
            
            <StaggerItem>
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 bg-gradient-to-b from-card to-card/50 group hover:scale-105">
                <CardHeader>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Rocket className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl">Production Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Master patterns used in real apps. Learn testing, performance optimization, 
                    and deployment to app stores.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
            
            <StaggerItem>
              <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 bg-gradient-to-b from-card to-card/50 group hover:scale-105">
                <CardHeader>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Target className="h-10 w-10 text-pink-600 dark:text-pink-400" />
                  </div>
                  <CardTitle className="text-2xl">Latest Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    All code follows 2025 best practices with React 18+, React Native 0.74+, 
                    and modern tooling.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section - Final Push */}
      <section className="container mx-auto px-4 py-32 relative">
        <ScrollReveal direction="up">
          <Card className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 overflow-hidden relative group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <CardHeader className="text-center space-y-6 pb-8 relative z-10">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm">
                  <Trophy className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <CardTitle className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Ready to Start Building?
              </CardTitle>
              <CardDescription className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
                Join thousands of developers learning React Native from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center gap-4 pb-12 relative z-10">
              <MagneticButton>
                <Button asChild size="lg" className="text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all group/btn">
                  <Link href="/course/part1/what-is-react-native">
                    <BookOpen className="mr-2 h-5 w-5 group-hover/btn:rotate-12 transition-transform" />
                    Begin Chapter 1
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button asChild size="lg" variant="neutral" className="text-lg px-10 py-7 rounded-full backdrop-blur-sm">
                  <Link href="/course">
                    <Sparkles className="mr-2 h-5 w-5" />
                    View All Chapters
                  </Link>
                </Button>
              </MagneticButton>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>
    </div>
  );
}
