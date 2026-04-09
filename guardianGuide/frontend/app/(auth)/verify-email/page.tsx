"use client";
import ShieldLogo from "@/components/ui/ShieldLogo";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md text-center">
      <ShieldLogo size={48} />
      <h1 className="text-heading-1 text-text-primary mt-4 mb-2 font-semibold">Check your email</h1>
      <p className="text-body text-text-secondary mb-8">
        We sent a verification link to your email. Click it to continue.
      </p>
      <Link href="/login">
        <Button variant="secondary" fullWidth>Back to login</Button>
      </Link>
    </div>
  );
}
