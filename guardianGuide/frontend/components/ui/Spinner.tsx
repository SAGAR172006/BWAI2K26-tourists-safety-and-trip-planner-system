export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      style={{ color: "var(--color-accent)" }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
    </svg>
  );
}
