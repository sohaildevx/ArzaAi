"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";
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
  const router = useRouter();
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
                      i === step ? "text-accent" : i < step ? "text-primary" : "text-muted-foreground"
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
                    <div>
                      <p className="font-semibold text-foreground">{type.marathi}</p>
                      <p className="text-xs text-muted-foreground">{type.english}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                    </div>
                    {form.docType === type.id && (
                      <div className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
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
                    (मराठी किंवा इंग्रजीत सांगा — AI योग्य भाषेत अर्ज तयार करेल)
                  </span>
                </Label>
                <textarea
                  id="situation"
                  rows={6}
                  placeholder="उदा: माझ्या शेजाऱ्याने माझ्या जमिनीवर अतिक्रमण केले आहे. गेल्या ३ वर्षांपासून हा वाद चालू आहे. तलाठी कार्यालयात तक्रार करूनही काही झाले नाही..."
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
            <div>
              <h2 className="text-2xl font-bold text-primary">पूर्वावलोकन</h2>
              <p className="text-muted-foreground mt-1">
                तुमच्या अर्जाचा सारांश तपासा — Review your document details
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
                { label: "प्राप्तकर्ता", value: [form.recipientName, form.recipientDesignation].filter(Boolean).join(", ") },
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
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{form.situation}</p>
              </div>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/8 px-5 py-4 flex items-start gap-3">
              <span className="text-xl mt-0.5">⚡</span>
              <div>
                <p className="text-sm font-semibold text-accent">AI अर्ज तयार करण्यासाठी सज्ज आहे</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generate करा बटण दाबल्यावर ArzaAI योग्य फॉर्मेटमध्ये तुमचा{" "}
                  {selectedType?.marathi} तयार करेल. (AI integration coming soon)
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                बदल करा
              </Button>
              <Button
                className="bg-accent hover:bg-accent/90 text-white gap-2 min-w-[160px]"
                disabled
              >
                <Loader2 className="h-4 w-4" />
                Generate करा — लवकरच
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
