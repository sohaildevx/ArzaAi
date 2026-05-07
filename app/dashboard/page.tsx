"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Loader2, LogOut, Plus, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DISPUTE_CATEGORIES, SUB_CATEGORIES, AUTHORITIES } from "@/lib/document-config";

interface DocumentSummary {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  authority: string;
  createdAt: string;
}

function getCategoryIcon(category: string): string {
  return DISPUTE_CATEGORIES.find((c) => c.id === category)?.icon ?? "📄";
}

function getSubCategoryLabel(category: string, subCategory: string): string {
  const subs = SUB_CATEGORIES[category] ?? [];
  return subs.find((s) => s.id === subCategory)?.label ?? subCategory;
}

function getAuthorityLabel(authority: string): string {
  return AUTHORITIES[authority]?.label ?? authority;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("mr-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) router.replace("/sign-in");
  }, [session, isPending, router]);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoadingDocs(true);
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents ?? []);
      }
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchDocuments();
  }, [session, fetchDocuments]);

  async function handleDelete(id: string) {
    if (!confirm("हा दस्तऐवज कायमचा हटवायचा का?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

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
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary">
            Arza<span className="text-accent">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{session.user.email}</span>
          <Button variant="outline" size="sm" disabled={signingOut}
            onClick={async () => { setSigningOut(true); await signOut(); router.push("/sign-in"); }}
            className="group transition-all duration-200 hover:border-destructive hover:text-destructive">
            {signingOut
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <LogOut className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:translate-x-0.5" />}
            {signingOut ? "साइन आउट होत आहे..." : "साइन आउट"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome + New button */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">
              नमस्कार, {session.user.name ?? session.user.email} 👋
            </h1>
            <p className="text-muted-foreground">
              तुमचे ArzaAI डॅशबोर्ड — सर्व दस्तऐवज येथे सेव्ह होतात.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2 shrink-0" asChild>
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4" />
              नवीन अर्ज
            </Link>
          </Button>
        </div>

        {/* Document list */}
        {loadingDocs ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length === 0 ? (
          /* Empty state */
          <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-12 text-center flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">अजून कोणताही अर्ज नाही</p>
              <p className="text-sm text-muted-foreground mt-1">No documents yet — create your first one</p>
            </div>
            <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5" asChild>
              <Link href="/dashboard/new">
                <Plus className="h-4 w-4" />
                पहिला अर्ज तयार करा
              </Link>
            </Button>
          </div>
        ) : (
          /* Document cards */
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">
              {documents.length} दस्तऐवज — Your documents
            </p>
            {documents.map((doc) => (
              <div key={doc.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                {/* Icon */}
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-xl">
                  {getCategoryIcon(doc.category)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {getSubCategoryLabel(doc.category, doc.subCategory)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getAuthorityLabel(doc.authority)} &nbsp;·&nbsp; {formatDate(doc.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild className="gap-1.5 hidden sm:flex">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      पाहा
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="sm:hidden">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm"
                    disabled={deletingId === doc.id}
                    onClick={() => handleDelete(doc.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    {deletingId === doc.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
