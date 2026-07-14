import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function PUT(request, { params }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  const cancellation = await prisma.cancellationRequest.update({ where: { id }, data: { status } });
  if (status === "approved") {
    await prisma.order.update({ where: { id: cancellation.orderId }, data: { status: "cancelled" } });
  }
  return NextResponse.json({ cancellation });
}