"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-body-sm text-text-secondary font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          bg-bg-elevated border rounded-xl px-4 py-3 text-text-primary
          placeholder:text-text-muted outline-none transition-all
          ${error ? "border-error ring-1 ring-error/30" : "border-border focus:border-accent focus:ring-1 focus:ring-accent/30"}
          disabled:opacity-40 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-caption text-error">{error}</span>}
    </div>
  );
}
