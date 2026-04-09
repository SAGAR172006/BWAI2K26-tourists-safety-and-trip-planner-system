interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
}

export default function Avatar({ src, name = "?", size = 40 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden bg-accent/20 flex items-center justify-center flex-shrink-0"
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-accent font-semibold text-sm">{initials}</span>
      )}
    </div>
  );
}
