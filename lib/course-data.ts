export interface Chapter {
  id: string;
  number: number;
  title: string;
  slug: string;
  path: string;
  isNew?: boolean;
}

export interface CoursePart {
  id: string;
  number: number;
  title: string;
  description: string;
  chapters: Chapter[];
  status: 'completed' | 'in-progress' | 'coming-soon';
}

export interface CourseStats {
  totalChapters: number;
  totalParts: number;
  codeExamples: number;
  contentLines: number;
  estimatedHours: string;
}

export const courseStats: CourseStats = {
  totalChapters: 17,
  totalParts: 3,
  codeExamples: 95,
  contentLines: 26000,
  estimatedHours: '40-50',
};

export const courseParts: CoursePart[] = [
  {
    id: 'part1',
    number: 1,
    title: 'Foundations',
    description: 'Build your foundation and understand the basics',
    status: 'completed',
    chapters: [
      {
        id: 'ch01',
        number: 1,
        title: 'What is React Native & How It Works',
        slug: 'what-is-react-native',
        path: '/course_data/Part1-Foundations/Chapter01-What-Is-React-Native/README.md',
      },
      {
        id: 'ch02',
        number: 2,
        title: 'Environment Setup & Your First App',
        slug: 'environment-setup',
        path: '/course_data/Part1-Foundations/Chapter02-Environment-Setup/README.md',
      },
      {
        id: 'ch03',
        number: 3,
        title: 'Understanding Components - The Building Blocks',
        slug: 'understanding-components',
        path: '/course_data/Part1-Foundations/Chapter03-Understanding-Components/README.md',
      },
      {
        id: 'ch04',
        number: 4,
        title: 'Styling Your App',
        slug: 'styling-your-app',
        path: '/course_data/Part1-Foundations/Chapter04-Styling-Your-App/README.md',
      },
      {
        id: 'ch05',
        number: 5,
        title: 'Handling User Interaction',
        slug: 'handling-user-interaction',
        path: '/course_data/Part1-Foundations/Chapter05-Handling-User-Interaction/README.md',
      },
    ],
  },
  {
    id: 'part2',
    number: 2,
    title: 'Core Concepts',
    description: 'Master the fundamentals that power every app',
    status: 'completed',
    chapters: [
      {
        id: 'ch06',
        number: 6,
        title: 'Props - Passing Data Between Components',
        slug: 'props',
        path: '/course_data/Part2-Core-Concepts/Chapter06-Props/README.md',
      },
      {
        id: 'ch07',
        number: 7,
        title: 'State - Making Components Dynamic',
        slug: 'state',
        path: '/course_data/Part2-Core-Concepts/Chapter07-State/README.md',
      },
      {
        id: 'ch08',
        number: 8,
        title: 'Lists & Keys - Displaying Dynamic Data',
        slug: 'lists-and-keys',
        path: '/course_data/Part2-Core-Concepts/Chapter08-Lists-And-Keys/README.md',
      },
      {
        id: 'ch09',
        number: 9,
        title: 'useEffect - Side Effects & Lifecycle',
        slug: 'use-effect',
        path: '/course_data/Part2-Core-Concepts/Chapter09-UseEffect/README.md',
      },
      {
        id: 'ch10',
        number: 10,
        title: 'Navigation - Moving Between Screens',
        slug: 'navigation',
        path: '/course_data/Part2-Core-Concepts/Chapter10-Navigation/README.md',
      },
      {
        id: 'ch11',
        number: 11,
        title: 'Context API & Global State',
        slug: 'context-api',
        path: '/course_data/Part2-Core-Concepts/Chapter11-ContextAPI/README.md',
      },
    ],
  },
  {
    id: 'part3',
    number: 3,
    title: 'Advanced Topics',
    description: 'Professional patterns, native integration, and production practices',
    status: 'completed',
    chapters: [
      {
        id: 'ch12',
        number: 12,
        title: 'Architecture Patterns',
        slug: 'architecture-patterns',
        path: '/course_data/Part3-Advanced-Topics/Chapter12-Architecture-Patterns/README.md',
      },
      {
        id: 'ch13',
        number: 13,
        title: 'Advanced State Management (Zustand/Redux)',
        slug: 'advanced-state-management',
        path: '/course_data/Part3-Advanced-Topics/Chapter13-Advanced-State-Management/README.md',
      },
      {
        id: 'ch14',
        number: 14,
        title: 'Async Operations & Data Fetching (React Query)',
        slug: 'async-operations',
        path: '/course_data/Part3-Advanced-Topics/Chapter14-Async-Operations-Data-Fetching/README.md',
      },
      {
        id: 'ch15',
        number: 15,
        title: 'Native Modules & Platform APIs',
        slug: 'native-modules',
        path: '/course_data/Part3-Advanced-Topics/Chapter15-Native-Modules-Platform-APIs/README.md',
      },
      {
        id: 'ch16',
        number: 16,
        title: 'Testing Your React Native App',
        slug: 'testing',
        path: '/course_data/Part3-Advanced-Topics/Chapter16-Testing/README.md',
      },
      {
        id: 'ch17',
        number: 17,
        title: 'Performance & Production Ready',
        slug: 'performance-production',
        path: '/course_data/Part3-Advanced-Topics/Chapter17-Performance-Production/README.md',
      },
    ],
  },
];

export function getAllChapters(): Chapter[] {
  return courseParts.flatMap(part => part.chapters);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return getAllChapters().find(chapter => chapter.slug === slug);
}

export function getPartByNumber(partNumber: number): CoursePart | undefined {
  return courseParts.find(part => part.number === partNumber);
}

export function getNextChapter(currentSlug: string): Chapter | undefined {
  const chapters = getAllChapters();
  const currentIndex = chapters.findIndex(ch => ch.slug === currentSlug);
  return currentIndex >= 0 && currentIndex < chapters.length - 1
    ? chapters[currentIndex + 1]
    : undefined;
}

export function getPreviousChapter(currentSlug: string): Chapter | undefined {
  const chapters = getAllChapters();
  const currentIndex = chapters.findIndex(ch => ch.slug === currentSlug);
  return currentIndex > 0 ? chapters[currentIndex - 1] : undefined;
}
