import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(colors);
  } catch {
    return NextResponse.json({ error: "Color table not found. Run the migration SQL in Supabase." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, hex } = await req.json();
    const color = await prisma.color.create({ data: { name, hex } });
    return NextResponse.json(color, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating color" }, { status: 500 });
  }
}
