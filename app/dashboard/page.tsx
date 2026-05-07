"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-white"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary">
            Arza<span className="text-accent">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {session.user.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              await signOut();
              router.push("/sign-in");
            }}
            className="group transition-all duration-200 hover:border-destructive hover:text-destructive"
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
            {signingOut ? "साइन आउट होत आहे..." : "साइन आउट"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">
              नमस्कार, {session.user.name ?? session.user.email} 👋
            </h1>
            <p className="text-muted-foreground">
              Your ArzaAI dashboard — legal document drafting starts here.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2 shrink-0" asChild>
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4" />
              नवीन अर्ज
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-12 text-center flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">अजून कोणताही अर्ज नाही</p>
            <p className="text-sm text-muted-foreground mt-1">
              No documents yet — create your first one
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5" asChild>
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4" />
              पहिला अर्ज तयार करा
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
