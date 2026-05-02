import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "मोफत",
    nameEn: "Free",
    price: "₹0",
    period: "नेहमी",
    credits: 5,
    description: "नवीन वापरकर्त्यांसाठी सुरुवात करण्यासाठी",
    features: [
      "5 क्रेडिट मोफत",
      "अर्ज, प्रतिज्ञापत्र",
      "PDF डाउनलोड",
      "मराठी / हिंदी इनपुट",
    ],
    cta: "मोफत सुरू करा",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "बेसिक",
    nameEn: "Basic",
    price: "₹99",
    period: "प्रति पॅक",
    credits: 30,
    description: "नियमित वापरकर्त्यांसाठी",
    features: [
      "30 क्रेडिट",
      "सर्व कागदपत्र प्रकार",
      "PDF + Word डाउनलोड",
      "हस्तलिखित OCR",
      "30 दिवस वैधता",
    ],
    cta: "खरेदी करा",
    href: "/signup?plan=basic",
    highlighted: true,
  },
  {
    name: "प्रो",
    nameEn: "Pro",
    price: "₹249",
    period: "प्रति पॅक",
    credits: 100,
    description: "वकील व व्यावसायिकांसाठी",
    features: [
      "100 क्रेडिट",
      "सर्व कागदपत्र प्रकार",
      "PDF + Word डाउनलोड",
      "हस्तलिखित OCR",
      "प्राधान्य प्रक्रिया",
      "90 दिवस वैधता",
    ],
    cta: "खरेदी करा",
    href: "/signup?plan=pro",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            किंमत
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            परवडणाऱ्या दरात कायदेशीर कागदपत्रे
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simple credit-based pricing. No subscriptions. Pay only for what you use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.nameEn}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 transition-all ${
                plan.highlighted
                  ? "border-accent bg-primary text-white shadow-xl scale-105"
                  : "border-border bg-white hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
                    <Zap className="h-3 w-3" /> सर्वात लोकप्रिय
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <h3 className={`text-xl font-bold ${plan.highlighted ? "text-white" : "text-primary"}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs ${plan.highlighted ? "text-white/70" : "text-muted-foreground"}`}>
                  {plan.nameEn} · {plan.description}
                </p>
              </div>

              <div className="flex items-end gap-1">
                <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-primary"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm mb-1 ${plan.highlighted ? "text-white/70" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <div className={`rounded-xl px-4 py-2 text-center text-sm font-semibold ${
                plan.highlighted ? "bg-white/15 text-white" : "bg-primary/8 text-primary"
              }`}>
                ⚡ {plan.credits} क्रेडिट
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-accent" : "text-green-600"}`} />
                    <span className={plan.highlighted ? "text-white/90" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full font-semibold ${
                  plan.highlighted
                    ? "bg-accent hover:bg-accent/90 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          * एक कागदपत्र = 1 क्रेडिट · हस्तलिखित OCR = 1 क्रेडिट · सर्व किंमती GST सहित
        </p>
      </div>
    </section>
  );
}
