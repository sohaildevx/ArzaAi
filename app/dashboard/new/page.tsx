"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, ArrowRight, FileText, Loader2, Copy, Check, RotateCcw, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  DISPUTE_CATEGORIES,
  SUB_CATEGORIES,
  AUTHORITIES,
  FIELD_CONFIGS,
  ANNEXURE_MAP,
  type FieldDef,
} from "@/lib/document-config";
import {toast} from "sonner";

const STEPS = ["प्रकार निवडा", "अधिकारी निवडा", "तपशील भरा", "Generate करा"] as const;

export default function NewDocumentPage() {
  const { data: session } = useSession();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [authority, setAuthority] = useState("");
  const [applicantName, setApplicantName] = useState(session?.user?.name ?? "");
  const [applicantAddress, setApplicantAddress] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [fields, setFields] = useState<Record<string, string>>({});

  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedCategory = DISPUTE_CATEGORIES.find((c) => c.id === category);
  const subCategories = category ? (SUB_CATEGORIES[category] ?? []) : [];
  const selectedSub = subCategories.find((s) => s.id === subCategory);
  const availableAuthorities = selectedSub?.authorities ?? [];
  const selectedAuthority = authority ? AUTHORITIES[authority] : null;
  const fieldDefs: FieldDef[] = subCategory ? (FIELD_CONFIGS[subCategory] ?? []) : [];
  const annexures: string[] = subCategory ? (ANNEXURE_MAP[subCategory] ?? []) : [];

  function setField(id: string, value: string) {
    setFields((prev) => ({ ...prev, [id]: value }));
  }

  function handleCategorySelect(id: string) {
    setCategory(id);
    setSubCategory("");
    setAuthority("");
    setFields({});
  }

  function handleSubCategorySelect(id: string) {
    setSubCategory(id);
    setAuthority("");
    setFields({});
    const subs = SUB_CATEGORIES[category] ?? [];
    const sub = subs.find((s) => s.id === id);
    if (sub && sub.authorities.length === 1) {
      setAuthority(sub.authorities[0]);
    }
  }

  const step1Valid = category !== "" && subCategory !== "";
  const step2Valid = authority !== "";
  const step3Valid =
    applicantName.trim() !== "" &&
    applicantAddress.trim() !== "" &&
    fieldDefs
      .filter((f) => f.required)
      .every((f) => (fields[f.id] ?? "").trim() !== "");

  async function handleGenerate() {
    setGenerating(true);
    setGenError("");
    setGeneratedDoc(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subCategory, authority, applicantName, applicantAddress, date, fields }),
      });
      const data = await res.json();
      if (!res.ok) { setGenError(data.error ?? "दस्तऐवज तयार करता आला नाही."); return; }
      toast.success("दस्तऐवज यशस्वीरित्या तयार झाला!");
      setGeneratedDoc(data.document);
    } catch {
      setGenError("नेटवर्क त्रुटी. इंटरनेट कनेक्शन तपासा.");
      toast.error("नेटवर्क त्रुटी. इंटरनेट कनेक्शन तपासा.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedDoc) return;
    await navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${selectedSub?.label ?? "दस्तऐवज"}</title>
      <style>body{font-family:"Noto Sans Devanagari","Mangal",Arial,sans-serif;font-size:14px;line-height:1.9;margin:2.5cm;color:#000;}
      pre{white-space:pre-wrap;word-wrap:break-word;font-family:inherit;font-size:inherit;line-height:inherit;}
      @media print{body{margin:2cm;}}</style></head>
      <body><pre>${generatedDoc?.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  function resetAll() {
    setStep(0); setCategory(""); setSubCategory(""); setAuthority("");
    setApplicantName(session?.user?.name ?? ""); setApplicantAddress(""); setDate(new Date().toISOString().split("T")[0]);
    setFields({}); setGeneratedDoc(null); setGenError("");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" />डॅशबोर्ड</Link>
        </Button>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">नवीन दस्तऐवज तयार करा</span>
        </div>
      </header>

      {/* Step bar */}
      {!generatedDoc && (
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i < step ? "bg-primary text-white" : i === step ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${
                    i === step ? "text-accent" : i < step ? "text-primary" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-px w-6 sm:w-12 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* ── STEP 0: Category + Sub-category ─────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">वादाचा / दस्तऐवजाचा प्रकार निवडा</h2>
              <p className="text-muted-foreground mt-1 text-sm">Select the category that best matches your situation</p>
            </div>

            {/* Category cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {DISPUTE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} type="button" onClick={() => handleCategorySelect(cat.id)}
                    className={`text-left rounded-xl border-2 p-4 transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 ${
                      category === cat.id ? "border-primary bg-primary/8 shadow-sm" : "border-border bg-card"}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-8 w-8 shrink-0 ${category === cat.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{cat.sublabel}</p>
                        <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
                      </div>
                      {category === cat.id && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub-category — shown once category is selected */}
            {category && subCategories.length > 0 && (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground">नक्की काय हवे आहे?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Select the specific type</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {subCategories.map((sub) => (
                    <button key={sub.id} type="button" onClick={() => handleSubCategorySelect(sub.id)}
                      className={`text-left rounded-lg border-2 px-4 py-3 transition-all duration-150 hover:border-accent/50 hover:bg-accent/5 ${
                        subCategory === sub.id ? "border-accent bg-accent/8 shadow-sm" : "border-border bg-card"}`}>
                      <p className="font-medium text-sm text-foreground">{sub.label}</p>
                      <p className="text-xs text-muted-foreground">{sub.sublabel}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button disabled={!step1Valid} onClick={() => {
                if (availableAuthorities.length === 1) { setStep(2); } else { setStep(1); }
              }} className="bg-primary hover:bg-primary/90 gap-2">
                पुढे जा <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Authority selection ──────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">अर्ज कोणाकडे सादर करायचा आहे?</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                <span className="text-accent font-medium">{selectedSub?.label}</span> — कोणत्या अधिकाऱ्याकडे?
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {availableAuthorities.map((authId) => {
                const auth = AUTHORITIES[authId];
                if (!auth) return null;
                return (
                  <button key={authId} type="button" onClick={() => setAuthority(authId)}
                    className={`text-left rounded-xl border-2 p-4 transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 ${
                      authority === authId ? "border-primary bg-primary/8 shadow-sm" : "border-border bg-card"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{auth.label}</p>
                        <p className="text-xs text-muted-foreground">{auth.sublabel}</p>
                      </div>
                      {authority === authId && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> मागे
              </Button>
              <Button disabled={!step2Valid} onClick={() => setStep(2)} className="bg-primary hover:bg-primary/90 gap-2">
                पुढे जा <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Guided intake fields ─────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">तपशील भरा</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                <span className="font-medium text-accent">{selectedSub?.label}</span>
                {selectedAuthority && <span className="text-muted-foreground"> → {selectedAuthority.label}</span>}
              </p>
            </div>

            {/* Applicant info */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                अर्जदाराची माहिती — Applicant
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">पूर्ण नाव *</Label>
                  <Input id="applicantName" placeholder="रामचंद्र विठ्ठल पाटील"
                    value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">दिनांक *</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicantAddress">पूर्ण पत्ता *</Label>
                <Input id="applicantAddress" placeholder="मु. पो. [गाव], ता. [तालुका], जि. [जिल्हा] - [पिनकोड]"
                  value={applicantAddress} onChange={(e) => setApplicantAddress(e.target.value)} className="h-11" />
              </div>
            </div>

            {/* Dynamic guided fields */}
            {fieldDefs.length > 0 && (
              <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  वादाचा / दस्तऐवजाचा तपशील
                </p>
                {fieldDefs.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                      {field.hint && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">({field.hint})</span>
                      )}
                    </Label>

                    {field.type === "textarea" && (
                      <textarea id={field.id} rows={4} placeholder={field.placeholder}
                        value={fields[field.id] ?? ""}
                        onChange={(e) => setField(field.id, e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
                    )}

                    {field.type === "select" && (
                      <select id={field.id} value={fields[field.id] ?? ""}
                        onChange={(e) => setField(field.id, e.target.value)}
                        className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="">निवडा…</option>
                        {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}

                    {(field.type === "text" || field.type === "date") && (
                      <Input id={field.id} type={field.type} placeholder={field.placeholder}
                        value={fields[field.id] ?? ""}
                        onChange={(e) => setField(field.id, e.target.value)} className="h-11" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Annexure tip */}
            {annexures.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold text-amber-800">
                    या अर्जासोबत हे दस्तऐवज जोडावे लागतील
                  </p>
                </div>
                <ul className="space-y-1 ml-6">
                  {annexures.map((a) => (
                    <li key={a} className="text-sm text-amber-800 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">•</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(availableAuthorities.length === 1 ? 0 : 1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> मागे
              </Button>
              <Button disabled={!step3Valid} onClick={() => setStep(3)} className="bg-primary hover:bg-primary/90 gap-2">
                पूर्वावलोकन <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Preview + Generate ───────────────────────────────────── */}
        {step === 3 && !generatedDoc && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">पूर्वावलोकन</h2>
              <p className="text-muted-foreground mt-1 text-sm">तपशील तपासा, नंतर Generate करा</p>
            </div>

            {/* Summary card */}
            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              <div className="px-5 py-4 bg-primary/5 flex items-center gap-3 flex-wrap">
                {selectedCategory && <selectedCategory.icon className="h-6 w-6 text-primary" />}
                <div>
                  <p className="font-semibold text-primary">{selectedSub?.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedCategory?.label} → {selectedAuthority?.label}
                  </p>
                </div>
              </div>
              {[
                { label: "अर्जदार",   value: applicantName },
                { label: "पत्ता",     value: applicantAddress },
                { label: "अधिकारी",  value: selectedAuthority?.label ?? "" },
                { label: "दिनांक",   value: date },
              ].map(({ label, value }) => (
                <div key={label} className="px-5 py-3 flex gap-4">
                  <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
              {fieldDefs.map((f) => {
                const val = fields[f.id];
                if (!val) return null;
                return (
                  <div key={f.id} className="px-5 py-3 flex gap-4">
                    <span className="text-sm text-muted-foreground w-24 shrink-0 leading-snug">{f.label}</span>
                    <span className="text-sm font-medium text-foreground whitespace-pre-wrap">{val}</span>
                  </div>
                );
              })}
            </div>

            {genError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {genError}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> बदल करा
              </Button>
              <Button onClick={handleGenerate} disabled={generating}
                className="bg-accent hover:bg-accent/90 text-white gap-2 min-w-[180px]">
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> तयार होत आहे…</>
                ) : (
                  <>⚡ Generate करा</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── OUTPUT: Generated document ───────────────────────────────────── */}
        {generatedDoc && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-primary">{selectedSub?.label} तयार झाला! ✅</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {selectedAuthority?.label} यांना सादर करण्यासाठी — copy, print किंवा PDF सेव्ह करा
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setGeneratedDoc(null); setGenError(""); }}
                className="gap-2 text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" /> पुन्हा Generate करा
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                {copied ? <><Check className="h-4 w-4 text-green-600" />कॉपी झाले!</>
                         : <><Copy className="h-4 w-4" />मजकूर कॉपी करा</>}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                🖨️ Print / PDF सेव्ह करा
              </Button>
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
                  {selectedSub?.label} — {selectedAuthority?.label}
                </span>
                <div className="w-16" />
              </div>
              <div className="p-6 sm:p-10">
                <pre className="whitespace-pre-wrap text-sm leading-8 text-foreground font-[inherit]">
                  {generatedDoc}
                </pre>
              </div>
            </div>

            {/* Annexures reminder */}
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

            {/* Legal disclaimer */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <span className="font-semibold">टीप:</span> हा मसुदा AI ने तयार केला आहे.
              सादर करण्यापूर्वी एखाद्या वकिलाकडून किंवा जाणकार व्यक्तीकडून तपासून घ्या.
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />डॅशबोर्डवर जा</Link>
              </Button>
              <Button variant="outline" onClick={resetAll} className="gap-2">
                नवीन दस्तऐवज तयार करा <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
