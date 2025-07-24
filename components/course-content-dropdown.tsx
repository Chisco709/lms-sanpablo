"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  isPublished: boolean;
  userProgress?: { isCompleted: boolean }[];
}

interface PensumTopic {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface CourseContentDropdownProps {
  topics: PensumTopic[];
  courseId: string;
}

export const CourseContentDropdown = ({ topics, courseId }: CourseContentDropdownProps) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/80 rounded-2xl p-6 border border-green-400/20 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-green-400" />
        Contenido del Curso
      </h2>
      
      <div className="space-y-2">
        {topics.map((topic) => {
          const publishedChapters = topic.chapters?.filter(ch => ch.isPublished) || [];
          const completedChapters = publishedChapters.filter(
            ch => ch.userProgress?.[0]?.isCompleted
          ).length;
          
          return (
            <div key={topic.id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50">
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{topic.title}</h3>
                    <p className="text-xs text-slate-400">
                      {completedChapters} de {publishedChapters.length} clases completadas
                    </p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {expandedTopic === topic.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>
              
              {expandedTopic === topic.id && (
                <div className="border-t border-slate-700/50 p-2 space-y-1">
                  {publishedChapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/courses/${courseId}/chapters/${chapter.id}`}
                      className="block p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          chapter.userProgress?.[0]?.isCompleted 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {chapter.userProgress?.[0]?.isCompleted ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          chapter.userProgress?.[0]?.isCompleted 
                            ? 'text-green-400' 
                            : 'text-slate-300'
                        }`}>
                          {chapter.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
