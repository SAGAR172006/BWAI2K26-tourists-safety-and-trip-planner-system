"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/destination/${encodeURIComponent(value.trim().toLowerCase().replace(/\s+/g, "-"))}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Where do you want to go?"
          className="w-full pl-14 pr-6 py-4 rounded-2xl border border-border bg-bg-secondary text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none text-body transition-all"
          style={{ fontSize: "1.05rem" }}
        />
      </div>
    </form>
  );
}
