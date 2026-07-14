import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  const { id } = await params;
  const { reason, details } = await request.json();

  const existing = await prisma.cancellationRequest.findUnique({ where: { orderId: id } });
  if (existing) return NextResponse.json({ error: "A cancellation request already exists for this order" }, { status: 409 });

  const cancellation = await prisma.cancellationRequest.create({
    data: { orderId: id, reason: reason || "Not specified", details: details || "" },
  });
  return NextResponse.json({ cancellation });
}