import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({ credits: user?.credits ?? 0 });
  } catch (err) {
    console.error("[credits/GET]", err);
    return NextResponse.json({ error: "सर्व्हर त्रुटी." }, { status: 500 });
  }
}
