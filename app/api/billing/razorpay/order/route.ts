import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PLAN_PRICES_PAISE: Record<string, number> = {
  basic: 9900,
  pro: 24900,
};

function getRazorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_LIVE_KEY || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_LIVE_SECRET || "";
  return { keyId, keySecret };
}

function buildReceipt(userId: string) {
  const suffix = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  return `rcpt_${Date.now().toString(36)}_${suffix}`.slice(0, 40);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan?: string };
    const amount = plan ? PLAN_PRICES_PAISE[plan] : undefined;

    if (!plan || !amount) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { keyId, keySecret } = getRazorpayKeys();
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys missing" }, { status: 500 });
    }

    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: buildReceipt(session.user.id),
        notes: {
          userId: session.user.id,
          plan,
        },
      }),
    });

    if (!orderRes.ok) {
      const error = await orderRes.text();
      return NextResponse.json({ error }, { status: 502 });
    }

    const order = (await orderRes.json()) as {
      id: string;
      amount: number;
      currency: string;
      receipt: string;
    };

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      plan,
    });
  } catch (err) {
    console.error("[razorpay/order]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
