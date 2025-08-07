"use client";

import toast from "react-hot-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface MultipleFileUploadProps {
  onChange: (urls: string[]) => void;
  endpoint: keyof typeof ourFileRouter;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  onUploadBegin?: () => void;
}

export const MultipleFileUpload = ({
  onChange,
  endpoint,
  multiple = true,
  maxFiles = 10,
  className = "",
  onUploadBegin
}: MultipleFileUploadProps) => {
  return (
    <div className={className}>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          const urls = res?.map((file) => file.url) || [];
          onChange(urls);
        }}
        onUploadError={(error: Error) => {
          toast.error(`Error: ${error?.message}`);
        }}
        onUploadBegin={onUploadBegin}
        config={{ 
          mode: "auto",
          appendOnPaste: true,
        }}
      />
    </div>
  );
};
