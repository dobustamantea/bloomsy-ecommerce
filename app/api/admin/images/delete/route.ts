import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/admin-auth";

const BUCKET = "product-images";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service role env vars");
  return createClient(url, key);
}

// Extracts the storage path from a full Supabase public URL.
// e.g. https://<ref>.supabase.co/storage/v1/object/public/product-images/productos/slug/img.jpg
//   → productos/slug/img.jpg
function pathFromUrl(url: string): string | null {
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    const body = await req.json() as { path?: string; url?: string };
    const storagePath = body.path ?? (body.url ? pathFromUrl(body.url) : null);

    if (!storagePath) {
      return NextResponse.json({ error: "Ruta de imagen requerida." }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);

    if (error) {
      console.error("[DELETE /api/admin/images/delete] storage error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/images/delete] error:", err);
    return NextResponse.json({ error: "No se pudo eliminar la imagen." }, { status: 500 });
  }
}
