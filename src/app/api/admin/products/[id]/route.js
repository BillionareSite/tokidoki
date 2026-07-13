import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/auth";

function getAdmin(request) {
  const token = request.cookies.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function PUT(request, { params }) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await request.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        originalPrice: parseFloat(data.originalPrice || data.price),
        images: data.images || [],
        category: data.category,
        concentration: data.concentration,
        topNotes: data.topNotes || [],
        middleNotes: data.middleNotes || [],
        baseNotes: data.baseNotes || [],
        sizeMl: parseInt(data.sizeMl),
        gender: data.gender,
        longevity: data.longevity || "",
        sillage: data.sillage || "",
        stock: parseInt(data.stock),
        featured: !!data.featured,
      },
    });
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!getAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}