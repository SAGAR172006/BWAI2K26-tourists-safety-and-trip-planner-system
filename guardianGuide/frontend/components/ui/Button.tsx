"use client";
import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "icon";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent-hover transition-colors",
  secondary:
    "bg-transparent border border-border-strong text-text-primary px-6 py-3 rounded-xl hover:bg-bg-elevated transition-colors",
  danger:
    "bg-transparent border border-error text-error px-6 py-3 rounded-xl hover:bg-error/10 transition-colors",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary px-4 py-2 rounded-xl transition-colors",
  icon:
    "w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-border transition-colors",
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles[variant]} ${fullWidth ? "w-full" : ""} disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
