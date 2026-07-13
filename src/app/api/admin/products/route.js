import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

function getAdmin(request) {
  const token = request.cookies.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function GET(request) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        originalPrice: parseFloat(data.originalPrice || data.price),
        images: data.images || [],
        category: data.category,
        concentration: data.concentration || "EDP",
        topNotes: data.topNotes || [],
        middleNotes: data.middleNotes || [],
        baseNotes: data.baseNotes || [],
        sizeMl: parseInt(data.sizeMl) || 50,
        gender: data.gender || "unisex",
        longevity: data.longevity || "",
        sillage: data.sillage || "",
        stock: parseInt(data.stock) || 0,
        featured: !!data.featured,
      },
    });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}