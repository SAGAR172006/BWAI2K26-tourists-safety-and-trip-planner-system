"use client";
import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
          <div className="bg-bg-elevated border border-border text-text-secondary text-caption px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
