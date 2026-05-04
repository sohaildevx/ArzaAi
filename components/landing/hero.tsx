import Link from "next/link";
import { ArrowRight, Upload, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              महाराष्ट्र न्यायालयासाठी AI
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-primary">
              कोर्ट टाइपिस्टशिवाय{" "}
              <span className="text-accent">अर्ज, प्रतिज्ञापत्र</span>{" "}
              तयार करा
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              ArzaAI च्या मदतीने तुमचे हस्तलिखित कागद अपलोड करा किंवा सोप्या
              भाषेत परिस्थिती सांगा — आम्ही योग्य फॉर्मेटमध्ये कायदेशीर
              कागदपत्र तयार करतो.
            </p>

            <p className="text-sm text-muted-foreground italic">
              Upload your handwritten document or describe your situation — we generate a properly formatted legal document in Marathi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2" asChild>
                <Link href="/sign-up">
                  मोफत सुरू करा
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 text-primary gap-2" asChild>
                <Link href="#how-it-works">
                  हे कसे काम करते
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="text-green-600 font-bold">✓</span>
                <span>नोंदणी मोफत</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-green-600 font-bold">✓</span>
                <span>5 अर्ज मोफत</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-green-600 font-bold">✓</span>
                <span>कोणताही सल्ला नाही</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-accent/20" />

              <div className="relative rounded-2xl border border-border bg-white shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">अर्ज — Draft</span>
                </div>

                <div className="space-y-3 font-[var(--font-devanagari)]">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-primary">माननीय न्यायालय, पुणे</p>
                    <p className="text-xs text-muted-foreground">दिवाणी न्यायाधीश (कनिष्ठ स्तर)</p>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="space-y-2">
                    <div className="h-2.5 rounded bg-muted w-full animate-pulse" />
                    <div className="h-2.5 rounded bg-muted w-5/6 animate-pulse" />
                    <div className="h-2.5 rounded bg-muted w-4/5 animate-pulse" />
                    <div className="h-2.5 rounded bg-muted w-full animate-pulse" />
                    <div className="h-2.5 rounded bg-muted w-3/4 animate-pulse" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                    <Upload className="h-3 w-3" />
                    अपलोड
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-1.5 text-xs font-medium text-accent">
                    <FileText className="h-3 w-3" />
                    तयार करा
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                    <Download className="h-3 w-3" />
                    PDF
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-lg">
                ⚡ 5 क्रेडिट मोफत
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
