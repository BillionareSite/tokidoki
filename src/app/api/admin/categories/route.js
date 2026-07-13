import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

function getAdmin(request) {
  const token = request.cookies.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET(request) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        icon: data.icon || "🌸",
        image: data.image || "",
        sortOrder: parseInt(data.sortOrder) || 0,
      },
    });
    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category (name must be unique)" }, { status: 500 });
  }
}