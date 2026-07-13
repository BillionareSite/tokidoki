import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

function getAdmin(request) {
  const token = request.cookies.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function DELETE(request, { params }) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}