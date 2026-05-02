import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                Arza<span className="text-accent">AI</span>
              </span>
            </div>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              महाराष्ट्र न्यायालय वापरकर्त्यांसाठी AI-आधारित कायदेशीर कागदपत्र निर्मिती.
            </p>
            <p className="text-xs text-white/50">
              ArzaAI does not provide legal advice. Documents are for drafting assistance only.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/90">उत्पादन</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">हे कसे काम करते</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">वैशिष्ट्ये</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">किंमत</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">नोंदणी करा</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/90">कायदेशीर</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/privacy" className="hover:text-white transition-colors">गोपनीयता धोरण</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">वापर अटी</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">परतावा धोरण</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">संपर्क</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 ArzaAI. सर्व हक्क राखीव.</p>
        </div>
      </div>
    </footer>
  );
}
