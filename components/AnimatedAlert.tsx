"use client";

import React from "react";
import { X } from "lucide-react";

interface AnimatedAlertProps {
  type?: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
}

export default function AnimatedAlert({
  type = "info",
  message,
  onClose,
}: AnimatedAlertProps) {
  const styles: Record<"success" | "error" | "info" | "warning", string> = {
    success: "border-[#2563EB]",
    error: "border-[#2563EB]",
    info: "border-[#2563EB]",
    warning: "border-yellow-400",
  };

  return (
    <div
      className={`fixed right-55 top-100 bg-black border ${styles[type]} 
  rounded-xl px-6 py-4 w-80 shadow-xl z-[9999] animate-slide-in-right`}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      <h2 className="text-white text-lg font-semibold mb-1">
        {type === "error"
          ? "Error"
          : type === "success"
          ? "Success"
          : type === "warning"
          ? "Warning"
          : "Info"}
      </h2>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
