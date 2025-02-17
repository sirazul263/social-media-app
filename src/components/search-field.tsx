"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

export const SearchField = () => {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };
  return (
    <form onSubmit={handleSubmit} method="GET" action={"/search"}>
      <div className="relative">
        <Input name="q" placeholder="Search..." className="pe-10" />
        <SearchIcon
          type="submit"
          className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground"
        />
      </div>
    </form>
  );
};
