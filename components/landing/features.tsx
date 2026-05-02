import {
  ScanText,
  FileSignature,
  Languages,
  PenLine,
  ShieldCheck,
  FileDown,
} from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "हस्तलिखित OCR",
    titleEn: "Handwritten OCR",
    description:
      "हस्तलिखित अर्जाचा फोटो अपलोड करा — AI ते वाचून स्वच्छ मराठी मजकूर तयार करते.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: FileSignature,
    title: "कायदेशीर टेम्पलेट्स",
    titleEn: "Legal Templates",
    description:
      "अर्ज, प्रतिज्ञापत्र, दरखास्त — सर्व महाराष्ट्र न्यायालयाच्या फॉर्मेटमध्ये.",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Languages,
    title: "मराठी / हिंदी इनपुट",
    titleEn: "Marathi / Hindi Input",
    description:
      "मराठी किंवा हिंदीमध्ये परिस्थिती सांगा — AI योग्य कायदेशीर भाषेत अनुवाद करते.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: PenLine,
    title: "संपादन करा",
    titleEn: "Edit Before Export",
    description:
      "तयार केलेले कागद थेट ब्राउझरमध्ये संपादित करा. कोणताही वेगळा सॉफ्टवेअर नाही.",
    color: "text-green-700 bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "सुरक्षित व खाजगी",
    titleEn: "Secure & Private",
    description:
      "तुमचे दस्तावेज एन्क्रिप्टेड आहेत. आम्ही कायदेशीर सल्ला देत नाही — फक्त मसुदा.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: FileDown,
    title: "PDF / Word निर्यात",
    titleEn: "PDF / Word Export",
    description:
      "एका क्लिकमध्ये PDF किंवा Word फॉर्मेटमध्ये डाउनलोड करा. प्रिंटसाठी तयार.",
    color: "text-orange-600 bg-orange-50",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            वैशिष्ट्ये
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            तुम्हाला जे हवे ते सर्व एकाच ठिकाणी
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to create court-ready Marathi documents — no typist, no hassle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.titleEn}
                className="group rounded-2xl border border-border bg-white p-6 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-primary">{f.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{f.titleEn}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
