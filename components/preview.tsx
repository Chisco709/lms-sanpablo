"use client"

interface PreviewProps {
  value: string;
}

// Preview simple usando dangerouslySetInnerHTML, elimina ReactQuill y dependencias innecesarias
export const Preview = ({ value }: PreviewProps) => {
  return (
    <div
      className="prose prose-sm max-w-none text-gray-800 bg-white p-4 rounded-md border"
      dangerouslySetInnerHTML={{ __html: value || "<p class='italic text-slate-500'>Sin descripción</p>" }}
    />
  );
};