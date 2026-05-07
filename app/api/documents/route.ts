import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        subCategory: true,
        authority: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ documents });
  } catch (err) {
    console.error("[documents/GET]", err);
    return NextResponse.json({ error: "सर्व्हर त्रुटी." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Document ID required" }, { status: 400 });

    // Ensure the document belongs to this user
    const doc = await db.document.findFirst({ where: { id, userId: session.user.id } });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[documents/DELETE]", err);
    return NextResponse.json({ error: "सर्व्हर त्रुटी." }, { status: 500 });
  }
}
