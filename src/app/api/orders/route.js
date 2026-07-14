import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyCustomerToken } from "@/lib/customerAuth";

export async function POST(request) {
  const body = await request.json();
  const { name, phone, whatsapp, address, pincode, email, items, couponCode } = body;

  if (!name || !phone || !address || !pincode || !items?.length) {
    return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
  }

  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  let total = 0;
  const verifiedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    const price = product ? product.price : item.price;
    total += price * item.qty;
    return { id: item.id, name: item.name, price, qty: item.qty, sizeMl: item.sizeMl, image: item.image };
  });

  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    appliedCoupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (appliedCoupon?.isActive) {
      discount = appliedCoupon.type === "percentage" ? (total * appliedCoupon.value) / 100 : appliedCoupon.value;
      if (appliedCoupon.maxDiscount > 0) discount = Math.min(discount, appliedCoupon.maxDiscount);
      discount = Math.min(discount, total);
    }
  }

  const order = await prisma.order.create({
    data: {
      orderId: `TK${Date.now().toString().slice(-8)}`,
      name, phone, whatsapp: whatsapp || "", address, pincode, email: email || "",
      items: verifiedItems,
      total: total - discount,
      discount,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      paymentMethod: "cod",
      status: "pending",
    },
  });

  if (appliedCoupon) {
    await prisma.coupon.update({ where: { id: appliedCoupon.id }, data: { totalUsed: { increment: 1 } } });
    const token = request.cookies.get("customer_token")?.value;
    const payload = token ? verifyCustomerToken(token) : null;
    if (payload) {
      await prisma.couponUsage.create({
        data: { couponId: appliedCoupon.id, userId: payload.id, email: payload.email, orderId: order.id },
      });
    }
  }

  return NextResponse.json({ order });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

  const orders = await prisma.order.findMany({
    where: { phone },
    orderBy: { createdAt: "desc" },
    include: { cancellationRequest: true },
  });
  return NextResponse.json({ orders });
}