import { CourseSidebar } from "@/components/course-sidebar";
import { CourseHeader } from "@/components/course-header";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <CourseHeader />
      <div className="flex-1 flex">
        <CourseSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
