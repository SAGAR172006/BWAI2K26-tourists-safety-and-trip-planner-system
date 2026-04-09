export default function ShieldLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2L4 7v9c0 6.627 5.149 12.314 12 14 6.851-1.686 12-7.373 12-14V7L16 2z"
        fill="var(--color-accent)"
        opacity="0.9"
      />
      <path
        d="M16 2L4 7v9c0 6.627 5.149 12.314 12 14 6.851-1.686 12-7.373 12-14V7L16 2z"
        stroke="var(--color-accent-hover)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M11 16l3.5 3.5L21 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
