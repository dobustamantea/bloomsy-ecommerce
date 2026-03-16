import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { name, hex } = await req.json();
    const color = await prisma.color.update({ where: { id }, data: { name, hex } });
    return NextResponse.json(color);
  } catch {
    return NextResponse.json({ error: "Error updating color" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.color.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting color" }, { status: 500 });
  }
}
