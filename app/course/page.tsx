import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseParts, courseStats } from "@/lib/course-data";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";

export default function CoursePage() {
  return (
    <div className="container max-w-5xl mx-auto p-6 md:p-10">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Badge variant="neutral">All Chapters</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Course Overview</h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive journey from React Native basics to production-ready applications
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">{courseStats.totalChapters}</CardTitle>
              <CardDescription>Total Chapters</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">{courseStats.codeExamples}+</CardTitle>
              <CardDescription>Code Examples</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">{courseStats.estimatedHours}</CardTitle>
              <CardDescription>Hours of Content</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Course Parts */}
        <div className="space-y-6">
          {courseParts.map((part) => (
            <Card key={part.id} className="overflow-hidden">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      Part {part.number}: {part.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {part.description}
                    </CardDescription>
                  </div>
                  <Badge variant="neutral">
                    {part.chapters.length} chapters
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {part.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/course/part${part.number}/${chapter.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {chapter.number}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {chapter.title}
                          </p>
                          {chapter.isNew && (
                            <Badge className="mt-1">NEW</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="neutral" size="sm">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Learning CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Begin?</h3>
            <p className="text-muted-foreground">
              Start with Chapter 1 and work your way through at your own pace
            </p>
            <Button asChild size="lg">
              <Link href="/course/part1/what-is-react-native">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Chapter 1
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
