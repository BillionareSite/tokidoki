import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

export async function DELETE(request, { params }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { isActive } = await request.json();
  const coupon = await prisma.coupon.update({ where: { id }, data: { isActive } });
  return NextResponse.json({ coupon });
}