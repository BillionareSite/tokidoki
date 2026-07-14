import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [products, orders, pendingCancellations, openTickets] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.cancellationRequest.count({ where: { status: "pending" } }),
    prisma.ticket.count({ where: { status: { not: "resolved" } } }),
  ]);

  return NextResponse.json({ products, orders, pendingCancellations, openTickets });
}