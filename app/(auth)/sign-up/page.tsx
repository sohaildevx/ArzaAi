"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import {toast} from "sonner";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "किमान ८ अक्षरे", met: password.length >= 8 },
    { label: "एक मोठे अक्षर (A-Z)", met: /[A-Z]/.test(password) },
    { label: "एक अंक (0-9)", met: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {checks.map((c) => (
        <li key={c.label} className="flex items-center gap-2 text-xs">
          <CheckCircle2
            className={`h-3.5 w-3.5 shrink-0 ${c.met ? "text-green-600" : "text-muted-foreground/40"}`}
          />
          <span className={c.met ? "text-green-700" : "text-muted-foreground"}>
            {c.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp.email({ name, email, password });

    if (error) {
      setError(error.message ?? "नोंदणी करताना त्रुटी आली. पुन्हा प्रयत्न करा.");
      toast.error(error.message ?? "नोंदणी करताना त्रुटी आली. पुन्हा प्रयत्न करा.");
      setLoading(false);
      return;
    }

    toast.success("नोंदणी यशस्वी! कृपया तुमच्या ईमेलची पुष्टी करा.");
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      
      <div className="flex lg:hidden items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
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
        <span className="text-xl font-bold text-primary">
          Arza<span className="text-accent">AI</span>
        </span>
      </div>

      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary">खाते तयार करा</h1>
        <p className="text-sm text-muted-foreground">
          Create your account — 5 free credits included
        </p>
      </div>

      
      <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/8 px-4 py-3">
        <span className="text-xl">⚡</span>
        <div>
          <p className="text-sm font-semibold text-accent">5 क्रेडिट मोफत</p>
          <p className="text-xs text-muted-foreground">नोंदणी केल्यावर लगेच मिळतात</p>
        </div>
      </div>

     
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            पूर्ण नाव
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="रामचंद्र पाटील"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            ईमेल पत्ता
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            पासवर्ड
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              नोंदणी होत आहे...
            </>
          ) : (
            "नोंदणी करा — मोफत"
          )}
        </Button>
      </form>

      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">
            आधीच खाते आहे?
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full h-11" asChild>
        <Link href="/sign-in">लॉग इन करा</Link>
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        नोंदणी करून तुम्ही आमच्या{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          वापर अटी
        </Link>{" "}
        आणि{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          गोपनीयता धोरण
        </Link>{" "}
        मान्य करता.
      </p>
    </div>
  );
}
