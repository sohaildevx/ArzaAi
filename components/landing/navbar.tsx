"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              Arza<span className="text-accent">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              हे कसे काम करते
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              वैशिष्ट्ये
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              किंमत
            </Link>
          </nav>


          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">लॉग इन</Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/signup">मोफत सुरू करा</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          <Link href="#how-it-works" className="block text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>
            हे कसे काम करते
          </Link>
          <Link href="#features" className="block text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>
            वैशिष्ट्ये
          </Link>
          <Link href="#pricing" className="block text-sm py-2 text-muted-foreground" onClick={() => setOpen(false)}>
            किंमत
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/login">लॉग इन</Link>
            </Button>
            <Button size="sm" className="w-full bg-primary" asChild>
              <Link href="/signup">मोफत सुरू करा</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
