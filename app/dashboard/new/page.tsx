"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, ArrowRight, FileText, Loader2, Copy, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const DOC_TYPES = [
  {
    id: "arj",
    marathi: "अर्ज",
    english: "General Application",
    desc: "न्यायालय किंवा सरकारी कार्यालयात सादर करण्यासाठी",
    icon: "📄",
  },
  {
    id: "pratidnyapatr",
    marathi: "प्रतिज्ञापत्र",
    english: "Affidavit",
    desc: "शपथेवर दिलेले लेखी विधान",
    icon: "✍️",
  },
  {
    id: "rti",
    marathi: "RTI अर्ज",
    english: "RTI Application",
    desc: "माहितीचा अधिकार कायद्याखाली अर्ज",
    icon: "🔍",
  },
  {
    id: "takrar",
    marathi: "तक्रार अर्ज",
    english: "Complaint",
    desc: "पोलीस, ग्राहक मंच किंवा अन्य अधिकाऱ्यांकडे तक्रार",
    icon: "⚖️",
  },
  {
    id: "notice",
    marathi: "कायदेशीर नोटीस",
    english: "Legal Notice",
    desc: "विरुद्ध पक्षाला पाठवण्यासाठी औपचारिक नोटीस",
    icon: "📨",
  },
  {
    id: "other",
    marathi: "इतर",
    english: "Other Document",
    desc: "वरील व्यतिरिक्त कोणताही कायदेशीर दस्तऐवज",
    icon: "📁",
  },
] as const;

type DocTypeId = (typeof DOC_TYPES)[number]["id"];

interface FormData {
  docType: DocTypeId | "";
  applicantName: string;
  applicantAddress: string;
  recipientName: string;
  recipientDesignation: string;
  subject: string;
  situation: string;
  date: string;
}

const STEPS = ["दस्तऐवज निवडा", "तपशील भरा", "पूर्वावलोकन"] as const;

export default function NewDocumentPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    docType: "",
    applicantName: session?.user?.name ?? "",
    applicantAddress: "",
    recipientName: "",
    recipientDesignation: "",
    subject: "",
    situation: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const selectedType = DOC_TYPES.find((d) => d.id === form.docType);

  const step1Valid = form.docType !== "";
  const step2Valid =
    form.applicantName.trim() !== "" &&
    form.applicantAddress.trim() !== "" &&
    form.recipientName.trim() !== "" &&
    form.subject.trim() !== "" &&
    form.situation.trim() !== "";

  async function handleGenerate() {
    setGenerating(true);
    setGenError("");
    setGeneratedDoc(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setGenError(data.error ?? "दस्तऐवज तयार करता आला नाही.");
        return;
      }

      setGeneratedDoc(data.document);
    } catch {
      setGenError("नेटवर्क त्रुटी. इंटरनेट कनेक्शन तपासा.");
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
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${selectedType?.marathi ?? "दस्तऐवज"}</title>
          <style>
            body {
              font-family: "Noto Sans Devanagari", "Mangal", Arial, sans-serif;
              font-size: 14px;
              line-height: 1.8;
              margin: 2.5cm;
              color: #000;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: inherit;
              font-size: inherit;
              line-height: inherit;
            }
            @media print {
              body { margin: 2cm; }
            }
          </style>
        </head>
        <body>
          <pre>${generatedDoc?.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="min-h-screen bg-background">
      
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            डॅशबोर्ड
          </Link>
        </Button>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">नवीन अर्ज तयार करा</span>
        </div>
      </header>

      
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i < step
                        ? "bg-primary text-white"
                        : i === step
                        ? "bg-accent text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      i === step
                        ? "text-accent"
                        : i < step
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 sm:w-16 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10">
        
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">कोणता दस्तऐवज तयार करायचा आहे?</h2>
              <p className="text-muted-foreground mt-1">What document do you need?</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {DOC_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => update("docType", type.id)}
                  className={`text-left rounded-xl border-2 p-4 transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 ${
                    form.docType === type.id
                      ? "border-primary bg-primary/8 shadow-sm"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{type.marathi}</p>
                      <p className="text-xs text-muted-foreground">{type.english}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                    </div>
                    {form.docType === type.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                disabled={!step1Valid}
                onClick={() => setStep(1)}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                पुढे जा
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">तपशील भरा</h2>
              <p className="text-muted-foreground mt-1">
                Fill in the details for your{" "}
                <span className="font-medium text-accent">{selectedType?.marathi}</span>
              </p>
            </div>

            <div className="space-y-5 rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                अर्जदाराची माहिती — Applicant Details
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">पूर्ण नाव *</Label>
                  <Input
                    id="applicantName"
                    placeholder="रामचंद्र विठ्ठल पाटील"
                    value={form.applicantName}
                    onChange={(e) => update("applicantName", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">दिनांक *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicantAddress">पूर्ण पत्ता *</Label>
                <Input
                  id="applicantAddress"
                  placeholder="मु. पो. सातारा, जि. सातारा, महाराष्ट्र - 415001"
                  value={form.applicantAddress}
                  onChange={(e) => update("applicantAddress", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-5 rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                प्राप्तकर्त्याची माहिती — Recipient Details
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">न्यायालय / कार्यालयाचे नाव *</Label>
                  <Input
                    id="recipientName"
                    placeholder="माननीय दिवाणी न्यायालय, पुणे"
                    value={form.recipientName}
                    onChange={(e) => update("recipientName", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientDesignation">पद / विभाग</Label>
                  <Input
                    id="recipientDesignation"
                    placeholder="जिल्हाधिकारी, पुणे"
                    value={form.recipientDesignation}
                    onChange={(e) => update("recipientDesignation", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                विषय आणि परिस्थिती — Subject & Situation
              </p>
              <div className="space-y-2">
                <Label htmlFor="subject">विषय (Subject) *</Label>
                <Input
                  id="subject"
                  placeholder="जमीन वाद सोडवण्याबाबत अर्ज"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="situation">
                  तुमची परिस्थिती / विनंती सांगा *
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    (मराठी किंवा इंग्रजीत — AI योग्य भाषेत अर्ज तयार करेल)
                  </span>
                </Label>
                <textarea
                  id="situation"
                  rows={6}
                  placeholder="उदा: माझ्या शेजाऱ्याने माझ्या जमिनीवर अतिक्रमण केले आहे. गेल्या ३ वर्षांपासून हा वाद चालू आहे..."
                  value={form.situation}
                  onChange={(e) => update("situation", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  जितके अधिक तपशील द्याल, तितका अर्ज अधिक अचूक होईल.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                मागे
              </Button>
              <Button
                disabled={!step2Valid}
                onClick={() => setStep(2)}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                पूर्वावलोकन पाहा
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        
        {step === 2 && (
          <div className="space-y-6">
            {/* If not yet generated — show summary */}
            {!generatedDoc && (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary">पूर्वावलोकन</h2>
                  <p className="text-muted-foreground mt-1">
                    तपशील तपासा, नंतर Generate करा
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                  <div className="px-6 py-4 bg-primary/5 flex items-center gap-3">
                    <span className="text-2xl">{selectedType?.icon}</span>
                    <div>
                      <p className="font-semibold text-primary">{selectedType?.marathi}</p>
                      <p className="text-xs text-muted-foreground">{selectedType?.english}</p>
                    </div>
                  </div>
                  {[
                    { label: "अर्जदार", value: form.applicantName },
                    { label: "पत्ता", value: form.applicantAddress },
                    {
                      label: "प्राप्तकर्ता",
                      value: [form.recipientName, form.recipientDesignation]
                        .filter(Boolean)
                        .join(", "),
                    },
                    { label: "विषय", value: form.subject },
                    { label: "दिनांक", value: form.date },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-6 py-3 flex gap-4">
                      <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>
                      <span className="text-sm text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="px-6 py-4">
                    <p className="text-sm text-muted-foreground mb-2">परिस्थिती / विनंती</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {form.situation}
                    </p>
                  </div>
                </div>

                {genError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {genError}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    बदल करा
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-accent hover:bg-accent/90 text-white gap-2 min-w-[180px]"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        तयार होत आहे...
                      </>
                    ) : (
                      <>
                        ⚡ Generate करा
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            
            {generatedDoc && (
              <>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">
                      {selectedType?.marathi} तयार झाला! ✅
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Your document is ready — copy, print, or save as PDF
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGeneratedDoc(null);
                      setGenError("");
                    }}
                    className="gap-2 text-muted-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    पुन्हा Generate करा
                  </Button>
                </div>

                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        कॉपी झाले!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        मजकूर कॉपी करा
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-2"
                  >
                    🖨️ Print / PDF सेव्ह करा
                  </Button>
                </div>

                
                <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedType?.marathi} — Draft
                    </span>
                    <div className="w-16" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <pre className="whitespace-pre-wrap font-[var(--font-devanagari,inherit)] text-sm leading-8 text-foreground">
                      {generatedDoc}
                    </pre>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                  <span className="font-semibold">टीप:</span> हा मसुदा AI ने तयार केला आहे.
                  सादर करण्यापूर्वी एखाद्या वकिलाकडून तपासून घ्या.
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      डॅशबोर्डवर जा
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(0);
                      setGeneratedDoc(null);
                      setForm({
                        docType: "",
                        applicantName: session?.user?.name ?? "",
                        applicantAddress: "",
                        recipientName: "",
                        recipientDesignation: "",
                        subject: "",
                        situation: "",
                        date: new Date().toISOString().split("T")[0],
                      });
                    }}
                    className="gap-2"
                  >
                    नवीन अर्ज तयार करा
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
