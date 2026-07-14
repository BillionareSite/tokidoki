import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { cancellationRequest: true } });
  return NextResponse.json({ orders });
}