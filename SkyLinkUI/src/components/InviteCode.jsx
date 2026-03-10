import React, { useState } from "react";
import { Copy, Check, ShieldCheck, Share2 } from "lucide-react";

export default function InviteCode({ port, token }) {
  const [copiedToken, setCopiedToken] = useState(false);

  if (!token) return null;

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
          <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          File Ready to Share!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your secure P2P tunnel is active. Share this unique PIN with the recipient.
        </p>
      </div>

      <div className="relative group">
        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 block uppercase tracking-widest text-center">
          Access PIN
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-green-200 dark:border-green-900/50 p-6 rounded-2xl font-mono text-4xl tracking-[0.5em] text-center text-green-600 dark:text-green-400 shadow-inner">
            {token}
          </div>
          <button
            onClick={copyTokenToClipboard}
            className={`p-6 rounded-2xl transition-all duration-300 shadow-lg ${
              copiedToken 
                ? "bg-green-600 text-white shadow-green-500/25" 
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600"
            }`}
            title={copiedToken ? "Copied!" : "Copy PIN"}
          >
            {copiedToken ? (
              <Check className="w-8 h-8" />
            ) : (
              <Copy className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl p-4 flex items-start gap-3">
        <Share2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          <span className="font-semibold block mb-1">Important:</span>
          Keep this window open. If you close this tab, the transfer connection will be lost and the PIN will expire.
        </p>
      </div>
    </div>
  );
}
