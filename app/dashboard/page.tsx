"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

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
            onClick={() => signOut().then(() => router.push("/sign-in"))}
          >
            <LogOut className="h-4 w-4 mr-2" />
            साइन आउट
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-2 mb-10">
          <h1 className="text-3xl font-bold text-primary">
            नमस्कार, {session.user.name ?? session.user.email} 👋
          </h1>
          <p className="text-muted-foreground">
            Your ArzaAI dashboard — legal document drafting starts here.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">अर्ज तयार करण्यासाठी येथे क्लिक करा</p>
          <p className="text-sm mt-1">Document creation coming soon.</p>
        </div>
      </main>
    </div>
  );
}
