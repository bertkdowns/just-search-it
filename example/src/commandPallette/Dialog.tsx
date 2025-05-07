import React, { useState, useEffect } from "react";
import { cn } from "./utils";

export function Dialog({ open, onOpenChange, children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "bg-white p-6 rounded shadow-lg relative",
          "max-w-lg w-full",
          "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => onOpenChange(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function DialogTrigger({ onClick, children }: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className="text-blue-500 hover:underline">
      {children}
    </button>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold mb-4">{children}</h2>;
}