import { auth } from "@clerk/nextjs/server";
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// Función de autenticación asíncrona
const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
}

// FileRouter para la aplicación, puede contener múltiples FileRoutes
export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const authResult = await auth();
            if (!authResult.userId) throw new Error("Unauthorized");
            return { userId: authResult.userId };
        })
        .onUploadComplete(() => {}),
    courseAttachment: f(["text", "image", "video", "audio", "pdf" ])
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({ video: {maxFileCount: 1, maxFileSize: "512GB"}})
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
    chapterPdf: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {})
} 

export type OurFileRouter = typeof ourFileRouter;
