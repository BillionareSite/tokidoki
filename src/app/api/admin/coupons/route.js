import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

function getAdmin(request) {
  const token = request.cookies.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET(request) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(request) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      description: data.description || "",
      type: data.type || "percentage",
      value: parseFloat(data.value),
      maxDiscount: parseFloat(data.maxDiscount) || 0,
      minCartValue: parseFloat(data.minCartValue) || 0,
      totalLimit: parseInt(data.totalLimit) || 0,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    },
  });
  return NextResponse.json({ coupon });
}