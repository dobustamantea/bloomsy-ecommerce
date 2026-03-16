"use client";

import {
  useRef,
  useState,
  useEffect,
  DragEvent,
  ChangeEvent,
} from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Check, Loader2, GripVertical } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImageUploaderProps {
  photos: string[];
  productSlug: string;
  onChange: (urls: string[]) => void;
}

type ItemStatus = "uploading" | "done" | "error";

interface Item {
  id: string;
  preview: string; // local blob URL or final storage URL
  url: string;     // final storage URL (empty while uploading)
  status: ItemStatus;
  error?: string;
  isLocal?: boolean; // true = blob URL that must be revoked on unmount
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MAX_PHOTOS = 8;
const BUCKET = "product-images";

async function compressIfNeeded(file: File): Promise<File> {
  const MB2 = 2 * 1024 * 1024;
  if (file.size <= MB2) return file;
  return new Promise((resolve) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      const ratio = Math.min(1, 1920 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) =>
          resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(src); resolve(file); };
    img.src = src;
  });
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function photosToItems(urls: string[]): Item[] {
  return urls.map((url) => ({
    id: url || makeId(),
    preview: url,
    url,
    status: "done",
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImageUploader({
  photos,
  productSlug,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>(() => photosToItems(photos));
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Sync when the parent changes photos (e.g., different product selected)
  const photosKey = photos.join("|");
  useEffect(() => {
    setItems(photosToItems(photos));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photosKey]);

  // Revoke any leftover local blob URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.isLocal) URL.revokeObjectURL(item.preview);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── State helpers ────────────────────────────────────────────────────────────

  function publish(updated: Item[]) {
    onChange(updated.filter((i) => i.status === "done").map((i) => i.url));
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.isLocal) URL.revokeObjectURL(target.preview);
      const updated = prev.filter((i) => i.id !== id);
      publish(updated);
      return updated;
    });
  }

  // ── Upload logic ─────────────────────────────────────────────────────────────

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;

    setItems((prev) => {
      const doneCount = prev.filter((i) => i.status === "done").length;
      if (doneCount >= MAX_PHOTOS) return prev;
      const slots = MAX_PHOTOS - doneCount;
      const toAdd = arr.slice(0, slots);
      const placeholders: Item[] = toAdd.map((f) => ({
        id: makeId(),
        preview: URL.createObjectURL(f),
        url: "",
        status: "uploading",
        isLocal: true,
        _file: f, // temporary, removed after upload
      } as Item & { _file: File }));
      // Kick off uploads asynchronously
      void processUploads(placeholders as (Item & { _file: File })[]);
      return [...prev, ...placeholders];
    });
  }

  async function processUploads(placeholders: (Item & { _file?: File })[]) {
    const slug = productSlug.trim() || "new";

    for (const placeholder of placeholders) {
      const file = (placeholder as { _file?: File })._file;
      if (!file) continue;
      try {
        const compressed = await compressIfNeeded(file);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `productos/${slug}/${Date.now()}-${safeName}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, compressed, { cacheControl: "3600", upsert: false });

        if (error) throw error;

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const publicUrl = data.publicUrl;

        setItems((prev) => {
          const updated = prev.map((item) =>
            item.id === placeholder.id
              ? {
                  ...item,
                  url: publicUrl,
                  preview: publicUrl,
                  status: "done" as const,
                  isLocal: false,
                }
              : item
          );
          publish(updated);
          return updated;
        });

        // Revoke local blob now that we have the real URL
        URL.revokeObjectURL(placeholder.preview);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al subir la imagen";
        setItems((prev) =>
          prev.map((item) =>
            item.id === placeholder.id
              ? { ...item, status: "error", error: msg }
              : item
          )
        );
      }
    }
  }

  // ── File input / drop zone ───────────────────────────────────────────────────

  function onZoneDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function onZoneDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function onZoneDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) void uploadFiles(e.dataTransfer.files);
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      void uploadFiles(e.target.files);
      e.target.value = "";
    }
  }

  // ── Drag-to-reorder ──────────────────────────────────────────────────────────

  function onItemDragStart(idx: number) {
    setDraggingIdx(idx);
  }

  function onItemDragOver(e: DragEvent, idx: number) {
    e.preventDefault();
    setDragOverIdx(idx);
  }

  function onItemDrop(e: DragEvent, idx: number) {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === idx) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggingIdx, 1);
      updated.splice(idx, 0, moved);
      publish(updated);
      return updated;
    });
    setDraggingIdx(null);
    setDragOverIdx(null);
  }

  function onItemDragEnd() {
    setDraggingIdx(null);
    setDragOverIdx(null);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const doneCount = items.filter((i) => i.status === "done").length;
  const isFull = doneCount >= MAX_PHOTOS;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {!isFull && (
        <div
          onDragOver={onZoneDragOver}
          onDragLeave={onZoneDragLeave}
          onDrop={onZoneDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors select-none ${
            isDragOver
              ? "border-black bg-black/5"
              : "border-black/20 hover:border-black/40 hover:bg-black/[0.02]"
          }`}
        >
          <Upload size={20} className="mx-auto mb-2 text-black/35" />
          <p className="text-sm text-black/55">
            Arrastra fotos aquí o{" "}
            <span className="text-black underline">toca para seleccionar</span>
          </p>
          <p className="text-xs text-black/30 mt-1">
            JPG · PNG · WEBP · máx 5 MB · hasta {MAX_PHOTOS} fotos
          </p>
        </div>
      )}

      {isFull && (
        <p className="text-xs text-black/40 text-center py-1">
          Límite de {MAX_PHOTOS} fotos alcanzado
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={onFileChange}
      />

      {/* Photo grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable={item.status === "done"}
              onDragStart={() => onItemDragStart(idx)}
              onDragOver={(e) => onItemDragOver(e, idx)}
              onDrop={(e) => onItemDrop(e, idx)}
              onDragEnd={onItemDragEnd}
              className={`relative aspect-square border overflow-hidden group transition-opacity ${
                draggingIdx === idx ? "opacity-40" : "opacity-100"
              } ${
                dragOverIdx === idx && draggingIdx !== idx
                  ? "border-2 border-black"
                  : "border-black/15"
              }`}
            >
              {/* Image preview */}
              <img
                src={item.preview}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Uploading spinner */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-black/60" />
                </div>
              )}

              {/* Error overlay */}
              {item.status === "error" && (
                <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center gap-1 p-1">
                  <p className="text-[9px] text-red-600 text-center leading-tight">
                    {item.error ?? "Error"}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[9px] text-red-700 underline"
                  >
                    Quitar
                  </button>
                </div>
              )}

              {/* Done checkmark (hover) */}
              {item.status === "done" && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-green-500/80 rounded-full p-0.5">
                    <Check size={9} className="text-white" />
                  </div>
                </div>
              )}

              {/* Portada badge */}
              {idx === 0 && item.status === "done" && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-[9px] text-center py-0.5 tracking-widest">
                  PORTADA
                </div>
              )}

              {/* Delete button */}
              {item.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-1 left-1 bg-white/85 hover:bg-red-500 hover:text-white text-black/55 rounded-full p-0.5 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={11} />
                </button>
              )}

              {/* Drag handle */}
              {item.status === "done" && (
                <div className="absolute bottom-6 right-1 opacity-0 group-hover:opacity-70 cursor-grab active:cursor-grabbing">
                  <GripVertical size={14} className="text-white drop-shadow" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {items.length > 1 && (
        <p className="text-[10px] text-black/30">
          Arrastra las fotos para reordenar · La primera es la portada
        </p>
      )}
    </div>
  );
}
