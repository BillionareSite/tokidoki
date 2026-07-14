import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function PUT(request, { params }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { reply, status } = await request.json();
  const ticket = await prisma.ticket.update({ where: { id }, data: { reply, status: status || "resolved" } });
  return NextResponse.json({ ticket });
}