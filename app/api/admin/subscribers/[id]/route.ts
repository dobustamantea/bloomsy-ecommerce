import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    await prisma.subscriber.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/subscribers/[id]] error:", error);
    return NextResponse.json(
      { error: "No fue posible eliminar el suscriptor." },
      { status: 500 }
    );
  }
}
