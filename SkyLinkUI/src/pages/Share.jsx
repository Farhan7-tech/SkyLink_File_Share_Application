import DashboardLayout from "../layout/DashboardLayout.jsx";
import React, { useState } from "react";
import InviteCode from "../components/InviteCode";
import FileDownload from "../components/FileDownload";
import FileUpload from "../components/FileUpload";
import axios from "axios";
import {
  Share2,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FileText,
  Info,
} from "lucide-react";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [port, setPort] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Increase timeout for large files (5 minutes)
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/upload`,
        formData,
        {
          timeout: 300000, // 5 minutes in milliseconds
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              console.log(`Upload progress: ${percentCompleted}%`);
            }
          },
        },
      );

      setPort(response.data.port);
      setToken(response.data.token); // Store the access token
    } catch (error) {
      console.error("Error uploading file:", error);

      // Show the actual error message from the server
      let errorMessage = "Failed to upload file. Please try again.";

      if (error.response?.data) {
        // If the server sent a text error message
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (port, downloadToken) => {
    setIsDownloading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/download/${port}?token=${
          downloadToken || ""
        }`,
        { responseType: "blob" },
      );

      // Create a Blob from response
      const blob = new Blob([response.data]);

      // Get filename from Content-Disposition
      let filename = "downloaded-file";
      const disposition = response.headers["content-disposition"];
      if (disposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          disposition,
        );
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      //Create a temporary link for download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename; // uses correct filename
      document.body.appendChild(link);
      link.click();

      //Cleanup
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(
        "Failed to download file. Please check the invite code and try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Share OR Receive">
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Share2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            P2P File Transfer
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
            Directly share files from your device to others securely.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="flex bg-gray-50 dark:bg-gray-900/50 p-1 border-b dark:border-gray-700">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "upload"
                  ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              <UploadIcon className="w-4 h-4" />
              Share a File
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "download"
                  ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("download")}
            >
              <DownloadIcon className="w-4 h-4" />
              Receive a File
            </button>
          </div>

          <div className="p-8">
            {activeTab === "upload" ? (
              <div className="space-y-6">
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                />

                {uploadedFile && !isUploading && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50 transition-all duration-300">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <FileText className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(uploadedFile.size / 1024)} KB • Ready to
                        share
                      </p>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-6 flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-900/30 border-t-purple-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UploadIcon className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
                      Uploading your file securely...
                    </p>
                  </div>
                )}

                <InviteCode port={port} token={token} />
              </div>
            ) : (
              <div className="space-y-6">
                <FileDownload
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />

                {isDownloading && (
                  <div className="mt-6 flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <DownloadIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
                      Downloading your file securely...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            <span className="font-semibold block mb-1">How it works:</span>
            P2P transfer allows you to share files directly without storing them
            on our servers permanently. Keep this tab open until the recipient
            finishes downloading the file.
          </p>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-xs dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} SkyLink • Secure Peer-to-Peer File
            Transfer Protocol
          </p>
        </footer>
      </div>
    </DashboardLayout>
  );
}
