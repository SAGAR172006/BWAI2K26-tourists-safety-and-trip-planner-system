export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(ellipse at center, #1A1A2E 0%, #0A0A0F 70%)",
      }}
    >
      {children}
    </div>
  );
}
