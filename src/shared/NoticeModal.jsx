import React, { useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";

// Site-styled replacement for window.alert()
// notice: { type: "success" | "error" | "info", title, message } or null
export default function NoticeModal({ notice, onClose, actionLabel = "Okay" }) {
  useEffect(() => {
    if (!notice) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notice, onClose]);

  if (!notice) return null;

  const isSuccess = notice.type === "success";
  const isError = notice.type === "error";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-8 text-center shadow-xl"
        style={{ fontFamily: "'D-DIN', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[#777] hover:text-[#737144] transition"
        >
          <X size={18} />
        </button>

        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isSuccess ? "bg-[#737144]/10" : isError ? "bg-[#9a6b5a]/10" : "bg-[#f4f3ed]"
          }`}
        >
          {isSuccess ? (
            <Check className="text-[#737144]" size={28} />
          ) : (
            <AlertCircle className={isError ? "text-[#9a6b5a]" : "text-[#737144]"} size={28} />
          )}
        </div>

        {notice.title && (
          <h2 className="mb-2 text-lg font-light uppercase tracking-[0.15em] text-[#737144]">
            {notice.title}
          </h2>
        )}
        {notice.message && (
          <p className="mb-6 text-sm leading-relaxed text-[#555]">{notice.message}</p>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-md bg-[#737144] py-3 text-xs font-light uppercase tracking-[0.15em] text-white transition-all hover:bg-[#5f5d3d]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
