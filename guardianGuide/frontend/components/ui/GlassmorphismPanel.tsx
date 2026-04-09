import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function GlassmorphismPanel({ children, className = "" }: Props) {
  return (
    <div className={`glass-panel rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
