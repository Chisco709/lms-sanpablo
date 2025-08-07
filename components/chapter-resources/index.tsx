"use client";

import { useState } from "react";
import { Video, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MultiplePdfUpload } from "./multiple-pdf-upload";
import { MultipleVideoUpload } from "./multiple-video-upload";

interface ChapterResourcesProps {
  courseId: string;
  chapterId: string;
  initialPdfUrls?: string[];
  initialVideoUrls?: string[];
}

export const ChapterResources = ({
  courseId,
  chapterId,
  initialPdfUrls = [],
  initialVideoUrls = []
}: ChapterResourcesProps) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'pdfs'>('videos');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2 mb-6">
        <Video className="h-4 w-4 text-purple-400" />
        <h2 className="text-xl text-white">
          Recursos del capítulo
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'videos'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            )}
          >
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pdfs')}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'pdfs'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            )}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos PDF
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'videos' ? (
          <MultipleVideoUpload 
            courseId={courseId}
            chapterId={chapterId}
            initialVideoUrls={initialVideoUrls}
          />
        ) : (
          <MultiplePdfUpload 
            courseId={courseId}
            chapterId={chapterId}
            initialPdfUrls={initialPdfUrls}
          />
        )}
      </div>
    </div>
  );
};
