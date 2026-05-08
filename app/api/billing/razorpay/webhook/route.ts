import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

const PLAN_CREDITS: Record<string, number> = {
  basic: 30,
  pro: 100,
};

function isSignatureValid(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const digestBuf = Buffer.from(digest);
  const signatureBuf = Buffer.from(signature);
  if (digestBuf.length !== signatureBuf.length) return false;
  return crypto.timingSafeEqual(digestBuf, signatureBuf);
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!isSignatureValid(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload?: {
      payment?: {
        entity?: {
          id: string;
          order_id: string | null;
          status: string;
          notes?: Record<string, string>;
        };
      };
    };
  };

  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment?.id) {
    return NextResponse.json({ error: "Missing payment payload" }, { status: 400 });
  }

  const userId = payment.notes?.userId;
  const plan = payment.notes?.plan;
  const creditsToAdd = plan ? PLAN_CREDITS[plan] : undefined;

  if (!userId || !plan || !creditsToAdd) {
    return NextResponse.json({ error: "Missing userId or plan" }, { status: 400 });
  }

  const existing = await db.creditTransaction.findUnique({
    where: { provider_reference: { provider: "razorpay", reference: payment.id } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ received: true });
  }

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: creditsToAdd } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        provider: "razorpay",
        reference: payment.id,
        plan,
        credits: creditsToAdd,
      },
    });
  });

  return NextResponse.json({ received: true });
}
