import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export default function FileUpload({ onFileUpload, isUploading }) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative group w-full p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300
        ${
          dragActive
            ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 shadow-inner"
            : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
        }
        ${isUploading ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`p-4 rounded-2xl transition-all duration-300 ${dragActive ? "bg-purple-500 text-white shadow-lg scale-110" : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-110"}`}
        >
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {dragActive ? "Drop to upload" : "Share a file"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Drag & drop your file here or{" "}
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              browse
            </span>{" "}
            to start sharing
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Secure
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Fast
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            P2P
          </span>
        </div>
      </div>
    </div>
  );
}
