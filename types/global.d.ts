declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      UPLOADTHING_SECRET: string;
      UPLOADTHING_APP_ID: string;
      NEXT_PUBLIC_APP_URL: string;
    }
  }
}

// Tipos para componentes comunes
export interface CourseWithProgress {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  categoryId: string | null;
  chapters: Chapter[];
  progress: number | null;
  category: {
    id: string;
    name: string;
  } | null;
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  userProgress?: {
    id: string;
    userId: string;
    chapterId: string;
    isCompleted: boolean;
  }[];
}

export {}; 