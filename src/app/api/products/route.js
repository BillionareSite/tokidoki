import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const search = searchParams.get("search");

  const where = {};
  if (category) where.category = category;
  if (gender) where.gender = gender;
  if (search) where.name = { contains: search, mode: "insensitive" };

  try {
    const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}