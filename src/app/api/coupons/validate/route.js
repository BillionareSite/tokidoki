import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const { code, cartTotal } = await request.json();
  if (!code) return NextResponse.json({ error: "Coupon code required" }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 404 });
  }
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
  }
  if (coupon.totalLimit > 0 && coupon.totalUsed >= coupon.totalLimit) {
    return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
  }
  if (cartTotal < coupon.minCartValue) {
    return NextResponse.json({ error: `Minimum cart value of ₹${coupon.minCartValue} required` }, { status: 400 });
  }

  let discount = coupon.type === "percentage" ? (cartTotal * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, cartTotal);

  return NextResponse.json({ valid: true, discount: Math.round(discount), code: coupon.code });
}