import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest, { params }: { params: { sizeId: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, sortOrder } = await req.json();
    await prisma.size.update({
      where: { id: params.sizeId },
      data: { name: name.trim(), ...(sortOrder !== undefined && { sortOrder }) },
    });
    revalidatePath("/admin");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error updating size" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { sizeId: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.size.delete({ where: { id: params.sizeId } });
    revalidatePath("/admin");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting size" }, { status: 500 });
  }
}
