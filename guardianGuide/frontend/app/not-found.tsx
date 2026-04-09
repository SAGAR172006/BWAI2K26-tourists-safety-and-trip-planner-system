import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-primary text-text-primary px-4">
      <h2 className="text-4xl font-display font-bold mb-4">404</h2>
      <p className="text-text-secondary mb-8 text-center max-w-md">The page you are looking for does not exist.</p>
      <Link href="/home">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
