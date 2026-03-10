import React, { useState } from "react";
import { Download, Lock, AlertCircle } from "lucide-react";

export default function FileDownload({ onDownload, isDownloading }) {
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!accessToken.trim()) {
      setError("Please enter the access PIN");
      return;
    }

    try {
      // Use a dummy port, since only PIN is used now
      await onDownload(0, accessToken.trim());
    } catch (err) {
      setError(
        "Failed to download the file. Please check the PIN and try again.",
      );
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
          <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ready to Receive?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter the unique 6-digit PIN shared with you to start the secure
          transfer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            id="accessToken"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="000 000"
            className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-mono text-2xl tracking-[0.5em] text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
            disabled={isDownloading}
            maxLength={6}
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isDownloading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25 active:scale-[0.98]"
          }`}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download Now</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <Lock className="w-3 h-3" />
        <span>End-to-end encrypted P2P transfer</span>
      </div>
    </div>
  );
}
