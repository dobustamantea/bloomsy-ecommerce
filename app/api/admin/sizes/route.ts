import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(sizes);
  } catch {
    return NextResponse.json({ error: "Size table not found. Run the migration SQL." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, sortOrder } = await req.json();
    const count = await prisma.size.count();
    const size = await prisma.size.create({
      data: { name: name.trim(), sortOrder: sortOrder ?? count },
    });
    return NextResponse.json(size, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating size" }, { status: 500 });
  }
}
