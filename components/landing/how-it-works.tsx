import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "अपलोड करा किंवा सांगा",
    titleEn: "Upload or Describe",
    description:
      "तुमचे हस्तलिखित कागद फोटो काढून अपलोड करा, किंवा मराठी/हिंदीमध्ये तुमची परिस्थिती सांगा.",
    descriptionEn: "Upload a photo of your handwritten document, or describe your situation in Marathi or Hindi.",
    color: "bg-primary/10 text-primary",
    border: "border-primary/20",
  },
  {
    step: "02",
    icon: Wand2,
    title: "AI कागदपत्र तयार करते",
    titleEn: "AI Generates Your Document",
    description:
      "आमचे AI न्यायालयाच्या नमुन्यानुसार योग्य फॉर्मेटमध्ये अर्ज, प्रतिज्ञापत्र किंवा अर्ज तयार करते.",
    descriptionEn: "Our AI creates a properly formatted arza, affidavit, or application matching court templates.",
    color: "bg-accent/15 text-accent",
    border: "border-accent/20",
  },
  {
    step: "03",
    icon: Download,
    title: "तपासा आणि डाउनलोड करा",
    titleEn: "Review & Download",
    description:
      "तयार केलेले कागद तपासा, हवे तसे बदल करा, आणि PDF किंवा Word फाइल डाउनलोड करा.",
    descriptionEn: "Review the generated document, make edits if needed, then download as PDF or Word.",
    color: "bg-green-50 text-green-700",
    border: "border-green-200",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            कार्यपद्धती
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            फक्त ३ सोप्या पायऱ्यांमध्ये
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            In just 3 simple steps, get your court-ready legal document without visiting a typist.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary/20 via-accent/40 to-green-300/60" />

          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative flex flex-col items-center text-center gap-4">
                <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 ${s.border} ${s.color} shadow-sm`}>
                  <Icon className="h-8 w-8" />
                  <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {s.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">{s.title}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{s.titleEn}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
