import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const { name, email, whatsapp, subject, message } = await request.json();
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: { name, email, whatsapp: whatsapp || "", subject, message, isGuest: true },
  });
  return NextResponse.json({ ticket });
}