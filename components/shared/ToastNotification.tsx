"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onDismiss: () => void;
}

export default function ToastNotification({ message, type = "info", onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const colors = {
    error: "bg-error text-white",
    success: "bg-success text-white",
    info: "bg-brand text-white",
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-sm font-medium max-w-sm animate-slide-up ${colors[type]}`}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 opacity-80 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
