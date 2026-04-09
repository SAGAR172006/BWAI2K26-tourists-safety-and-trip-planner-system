interface BadgeProps {
  label: string;
  variant?: "accent" | "green" | "red" | "white";
}

const styles = {
  accent: "bg-accent/10 text-accent border-accent/30",
  green: "bg-zone-green-bg text-zone-green border-zone-green/30",
  red: "bg-zone-red-bg text-zone-red border-zone-red/30",
  white: "bg-zone-white-bg text-zone-white border-zone-white/30",
};

export default function Badge({ label, variant = "accent" }: BadgeProps) {
  return (
    <span className={`text-caption px-2 py-0.5 rounded-full border ${styles[variant]}`}>
      {label}
    </span>
  );
}
