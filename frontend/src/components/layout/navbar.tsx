"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            {APP_NAME}
          </Link>
          <nav className="flex items-center gap-4">
            {/* Nav items will be added later */}
          </nav>
        </div>
      </div>
    </header>
  );
}
