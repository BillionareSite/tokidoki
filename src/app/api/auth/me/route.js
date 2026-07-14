import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyCustomerToken } from "@/lib/customerAuth";

function getUserPayload(request) {
  const token = request.cookies.get("customer_token")?.value;
  return token ? verifyCustomerToken(token) : null;
}

export async function GET(request) {
  const payload = getUserPayload(request);
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  const { password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

export async function PUT(request) {
  const payload = getUserPayload(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const user = await prisma.user.update({
    where: { id: payload.id },
    data: {
      name: data.name,
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      address: data.address || "",
      pincode: data.pincode || "",
      dob: data.dob || "",
      gender: data.gender || "",
    },
  });

  const { password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}