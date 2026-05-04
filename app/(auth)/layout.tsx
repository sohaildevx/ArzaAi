export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-white"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">
            Arza<span className="text-accent">AI</span>
          </span>
        </div>

        <div className="space-y-6">
          <blockquote className="space-y-3">
            <p className="text-3xl font-bold text-white leading-snug">
              "कोर्ट टाइपिस्टशिवाय अर्ज तयार करा — अगदी सोप्या भाषेत."
            </p>
            <p className="text-white/60 text-sm">
              Create court-ready Marathi legal documents without a typist.
            </p>
          </blockquote>

          <div className="flex gap-6">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-accent">10,000+</p>
              <p className="text-xs text-white/60">Documents created</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-accent">500+</p>
              <p className="text-xs text-white/60">Court users</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-accent">34</p>
              <p className="text-xs text-white/60">Districts covered</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30">
          © 2026 ArzaAI · Legal document drafting only · Not legal advice
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        {children}
      </div>
    </div>
  );
}
