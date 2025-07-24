"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  isPublished: boolean;
  isFree?: boolean;
  position?: number;
  userProgress?: { isCompleted: boolean }[];
  unlockDate?: string | null;
}

interface PensumTopic {
  id: string;
  title: string;
  description?: string | null;
  isPublished: boolean;
  position: number;
  chapters: Chapter[];
}

interface CourseContentDropdownProps {
  topics: PensumTopic[];
  courseId: string;
  hasAccess?: boolean;
}

export const CourseContentDropdown = ({ 
  topics, 
  courseId, 
  hasAccess = true 
}: CourseContentDropdownProps) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const isChapterLocked = (chapter: Chapter) => {
    if (hasAccess) return false;
    if (chapter.isFree) return false;
    
    if (chapter.unlockDate) {
      const unlockDate = new Date(chapter.unlockDate);
      const now = new Date();
      return unlockDate > now;
    }
    
    return !hasAccess;
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="bg-black/80 rounded-2xl p-6 border border-green-400/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-400" />
          Contenido del Curso
        </h2>
        <p className="text-slate-400 text-sm">No hay temas disponibles en este curso.</p>
      </div>
    );
  }

  return (
    <div className="bg-black/80 rounded-2xl p-4 border border-green-400/20">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-green-400" />
        Temas del Curso
      </h2>
      
      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {topics
          .filter(topic => topic.isPublished) // Only show published topics
          .sort((a, b) => a.position - b.position) // Sort by position
          .map((topic) => {
            const publishedChapters = topic.chapters?.filter(ch => ch.isPublished) || [];
            const completedChapters = publishedChapters.filter(
              ch => ch.userProgress?.[0]?.isCompleted
            ).length;
            const hasChapters = publishedChapters.length > 0;
            
            return (
              <div key={topic.id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50">
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/30 transition-colors"
                  aria-expanded={expandedTopic === topic.id}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      completedChapters === publishedChapters.length && hasChapters 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-slate-700/50 text-slate-300'
                    }`}>
                      {completedChapters === publishedChapters.length && hasChapters ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white text-sm">{topic.title}</h3>
                      {hasChapters && (
                        <p className="text-xs text-slate-400">
                          {completedChapters} de {publishedChapters.length} clases
                        </p>
                      )}
                    </div>
                  </div>
                  {hasChapters && (
                    <div className="text-slate-400 flex-shrink-0">
                      {expandedTopic === topic.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>
                
                {hasChapters && expandedTopic === topic.id && (
                  <div className="border-t border-slate-700/50 p-2 space-y-1">
                    {publishedChapters
                      .sort((a, b) => (a.position || 0) - (b.position || 0))
                      .map((chapter) => {
                        const isCompleted = chapter.userProgress?.[0]?.isCompleted;
                        const isLocked = isChapterLocked(chapter);
                        
                        return (
                          <Link
                            key={chapter.id}
                            href={isLocked ? '#' : `/courses/${courseId}/chapters/${chapter.id}`}
                            onClick={(e) => isLocked && e.preventDefault()}
                            className={`block p-2 rounded-lg transition-colors ${
                              isLocked 
                                ? 'opacity-60 cursor-not-allowed' 
                                : 'hover:bg-slate-700/30 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-slate-700/50 text-slate-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                )}
                              </div>
                              <span className={`text-xs ${
                                isCompleted 
                                  ? 'text-green-400' 
                                  : isLocked 
                                    ? 'text-slate-500' 
                                    : 'text-slate-300'
                              }`}>
                                {chapter.title}
                              </span>
                              {isLocked && (
                                <Lock className="h-3 w-3 text-slate-500 ml-auto flex-shrink-0" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
