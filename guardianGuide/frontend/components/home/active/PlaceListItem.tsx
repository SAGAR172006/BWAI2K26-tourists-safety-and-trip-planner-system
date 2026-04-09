"use client";
import { CheckCircle, ExternalLink } from "lucide-react";

interface Props {
  name: string;
  category?: string;
  onTick?: () => void;
  onNavigate?: () => void;
  ticked?: boolean;
}

export default function PlaceListItem({ name, category, onTick, onNavigate, ticked }: Props) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div>
        <p className="text-body-sm text-text-primary">{name}</p>
        {category && <p className="text-caption text-text-muted capitalize">{category}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onTick}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-bg-elevated transition-colors"
          aria-label="Mark visited"
        >
          <CheckCircle size={16} className={ticked ? "text-zone-green" : "text-text-muted"} />
        </button>
        <button
          onClick={onNavigate}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-bg-elevated transition-colors"
          aria-label="Open in maps"
        >
          <ExternalLink size={16} className="text-text-muted" />
        </button>
      </div>
    </div>
  );
}
