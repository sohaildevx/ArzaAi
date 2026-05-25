"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "काहीतरी चूक झाली आहे. पुन्हा प्रयत्न करा.");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-primary">पासवर्ड विसरलात?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive a password reset link.
        </p>
      </div>

      
      <form onSubmit={handleSubmit} className="space-y-5">
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
            className="h-11 bg-background"
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
        {success && (
          <p className="text-sm text-green-600 font-medium">
            पासवर्ड रीसेट लिंक पाठवली आहे. कृपया आपला ईमेल तपासा.
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full h-11 bg-primary text-white hover:bg-primary/90">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              कृपया प्रतीक्षा करा...
            </>
          ) : (
            "पुढे जा"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">आठवला? </span>
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          लॉग इन करा
        </Link>
      </div>
    </div>
  );
}
