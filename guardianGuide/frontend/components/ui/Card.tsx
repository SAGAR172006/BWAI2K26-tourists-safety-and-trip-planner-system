import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddings = { sm: "p-3", md: "p-4", lg: "p-6" };

export default function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div className={`bg-bg-secondary border border-border rounded-xl ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
