"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Loader2, Paperclip, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DISPUTE_CATEGORIES, SUB_CATEGORIES, AUTHORITIES, ANNEXURE_MAP } from "@/lib/document-config";

interface DocumentFull {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  authority: string;
  content: string;
  createdAt: string;
}

function getCategoryIcon(category: string): React.ElementType {
  return DISPUTE_CATEGORIES.find((c) => c.id === category)?.icon ?? FileText;
}

function getSubCategoryLabel(category: string, subCategory: string): string {
  const subs = SUB_CATEGORIES[category] ?? [];
  return subs.find((s) => s.id === subCategory)?.label ?? subCategory;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("mr-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DocumentViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) { setError("दस्तऐवज सापडला नाही."); return; }
        const data = await res.json();
        setDoc(data.document);
      } catch {
        setError("दस्तऐवज लोड करता आला नाही.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleCopy() {
    if (!doc) return;
    await navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    if (!doc) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${doc.title}</title>
      <style>body{font-family:"Noto Sans Devanagari","Mangal",Arial,sans-serif;font-size:14px;line-height:1.9;margin:2.5cm;color:#000;}
      pre{white-space:pre-wrap;word-wrap:break-word;font-family:inherit;font-size:inherit;line-height:inherit;}
      @media print{body{margin:2cm;}}</style></head>
      <body><pre>${doc.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  const annexures = doc ? (ANNEXURE_MAP[doc.subCategory] ?? []) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error || "दस्तऐवज सापडला नाही."}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> डॅशबोर्डवर जा
        </Button>
      </div>
    );
  }

  const subLabel = getSubCategoryLabel(doc.category, doc.subCategory);
  const authorityLabel = AUTHORITIES[doc.authority]?.label ?? doc.authority;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" />डॅशबोर्ड</Link>
        </Button>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center">
            {React.createElement(getCategoryIcon(doc.category), { className: "h-5 w-5 text-primary" })}
          </div>
          <span className="font-semibold text-primary truncate">{subLabel}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">{subLabel}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {authorityLabel} &nbsp;·&nbsp; {formatDate(doc.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <><Check className="h-4 w-4 text-green-600" />कॉपी झाले!</>
                       : <><Copy className="h-4 w-4" />कॉपी करा</>}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
          </div>
        </div>

        {/* Document viewer */}
        <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {subLabel} — {authorityLabel}
            </span>
            <div className="w-16" />
          </div>
          <div className="p-6 sm:p-10">
            <pre className="whitespace-pre-wrap text-sm leading-8 text-foreground font-[inherit]">
              {doc.content}
            </pre>
          </div>
        </div>

        {/* Annexures */}
        {annexures.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-2 mb-2">
              <Paperclip className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm font-semibold text-foreground">सोबत जोडायचे दस्तऐवज (Annexures)</p>
            </div>
            <ul className="space-y-1 ml-6">
              {annexures.map((a, i) => (
                <li key={a} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-medium shrink-0">{i + 1}.</span> {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <span className="font-semibold">टीप:</span> हा मसुदा AI ने तयार केला आहे.
          सादर करण्यापूर्वी एखाद्या वकिलाकडून किंवा जाणकार व्यक्तीकडून तपासून घ्या.
        </div>
      </main>
    </div>
  );
}
