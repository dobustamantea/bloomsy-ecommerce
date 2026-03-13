"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { chileanRegions } from "@/lib/account-schema";

interface AddressItem {
  id: string;
  label: string;
  recipientName: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string | null;
  isDefault: boolean;
}

interface AddressFormState {
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  isDefault: boolean;
}

interface AccountAddressBookProps {
  addresses: AddressItem[];
}

const emptyForm: AddressFormState = {
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  isDefault: false,
};

const inputClassName =
  "w-full border border-black/15 bg-white/70 px-4 py-3 text-sm text-bloomsy-black outline-none transition-colors placeholder:text-black/30 focus:border-black";

function toFormState(address?: AddressItem): AddressFormState {
  if (!address) {
    return emptyForm;
  }

  return {
    label: address.label,
    recipientName: address.recipientName,
    phone: address.phone ?? "",
    line1: address.line1,
    line2: address.line2 ?? "",
    city: address.city,
    region: address.region,
    postalCode: address.postalCode ?? "",
    isDefault: address.isDefault,
  };
}

function sortAddresses(addresses: AddressItem[]) {
  return [...addresses].sort((left, right) => {
    if (left.isDefault && !right.isDefault) {
      return -1;
    }

    if (!left.isDefault && right.isDefault) {
      return 1;
    }

    return left.label.localeCompare(right.label, "es");
  });
}

export default function AccountAddressBook({
  addresses,
}: AccountAddressBookProps) {
  const router = useRouter();
  const [localAddresses, setLocalAddresses] = useState(sortAddresses(addresses));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(addresses.length === 0);
  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeModeLabel = useMemo(() => {
    if (editingId) {
      return "Editar direccion";
    }

    return "Nueva direccion";
  }, [editingId]);

  function setField<K extends keyof AddressFormState>(
    field: K,
    value: AddressFormState[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreate() {
    setError("");
    setFeedback("");
    setEditingId(null);
    setIsCreating(true);
    setForm({
      ...emptyForm,
      isDefault: localAddresses.length === 0,
    });
  }

  function openEdit(address: AddressItem) {
    setError("");
    setFeedback("");
    setEditingId(address.id);
    setIsCreating(false);
    setForm(toFormState(address));
  }

  function closeForm() {
    setEditingId(null);
    setIsCreating(false);
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFeedback("");

    const endpoint = editingId
      ? `/api/account/addresses/${editingId}`
      : "/api/account/addresses";
    const method = editingId ? "PATCH" : "POST";

    startTransition(() => {
      void (async () => {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? "No fue posible guardar la direccion.");
          return;
        }

        const nextAddresses = editingId
          ? localAddresses.map((address) =>
              address.id === result.address.id ? result.address : address
            )
          : [...localAddresses, result.address];

        setLocalAddresses(sortAddresses(nextAddresses));
        setFeedback(
          editingId
            ? "La direccion fue actualizada."
            : "La direccion fue guardada."
        );
        closeForm();
        router.refresh();
      })();
    });
  }

  function handleDelete(addressId: string) {
    setDeletingId(addressId);
    setError("");
    setFeedback("");

    startTransition(() => {
      void (async () => {
        const response = await fetch(`/api/account/addresses/${addressId}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? "No fue posible eliminar la direccion.");
          setDeletingId(null);
          return;
        }

        setLocalAddresses((current) =>
          sortAddresses(current.filter((address) => address.id !== addressId))
        );
        setFeedback("La direccion fue eliminada.");
        setDeletingId(null);

        if (editingId === addressId) {
          closeForm();
        }

        router.refresh();
      })();
    });
  }

  return (
    <section className="border border-black/10 bg-white/50 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/40">
            Direcciones
          </p>
          <h2 className="mt-3 font-display text-3xl font-light">
            Libreta de direcciones
          </h2>
          <p className="mt-3 text-sm leading-7 text-black/60">
            Guarda tus direcciones frecuentes para comprar mas rapido.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 border border-black/15 px-4 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:border-black hover:bg-black hover:text-bloomsy-cream"
        >
          <Plus size={16} />
          Nueva direccion
        </button>
      </div>

      {error ? (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {feedback ? (
        <p className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedback}
        </p>
      ) : null}

      <div className="mt-8 grid gap-4">
        {localAddresses.length === 0 ? (
          <div className="border border-dashed border-black/15 px-6 py-10 text-sm leading-7 text-black/55">
            Aun no tienes direcciones guardadas.
          </div>
        ) : (
          localAddresses.map((address) => (
            <article
              key={address.id}
              className="border border-black/10 bg-bloomsy-cream/70 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-medium text-bloomsy-black">
                      {address.label}
                    </h3>
                    {address.isDefault ? (
                      <span className="border border-black/10 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-black/55">
                        Predeterminada
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-black/70">{address.recipientName}</p>
                  <p className="text-sm leading-7 text-black/55">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                    <br />
                    {address.city}, {address.region}
                    {address.postalCode ? `, ${address.postalCode}` : ""}
                    {address.phone ? (
                      <>
                        <br />
                        {address.phone}
                      </>
                    ) : null}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(address)}
                    className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-black"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    disabled={isPending && deletingId === address.id}
                    className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending && deletingId === address.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {isCreating || editingId ? (
        <div className="mt-8 border border-black/10 bg-bloomsy-cream p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-2xl font-light">{activeModeLabel}</h3>
            <button
              type="button"
              onClick={closeForm}
              className="text-[10px] tracking-[0.22em] uppercase text-black/45 transition-colors hover:text-bloomsy-black"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                  Nombre de la direccion
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(event) => setField("label", event.target.value)}
                  className={inputClassName}
                  placeholder="Casa, oficina, retiro..."
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                  Quien recibe
                </label>
                <input
                  type="text"
                  value={form.recipientName}
                  onChange={(event) =>
                    setField("recipientName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  className={inputClassName}
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                  Codigo postal
                </label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(event) => setField("postalCode", event.target.value)}
                  className={inputClassName}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Direccion
              </label>
              <input
                type="text"
                value={form.line1}
                onChange={(event) => setField("line1", event.target.value)}
                className={inputClassName}
                placeholder="Calle y numero"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                Referencia
              </label>
              <input
                type="text"
                value={form.line2}
                onChange={(event) => setField("line2", event.target.value)}
                className={inputClassName}
                placeholder="Depto, oficina, referencia..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                  Comuna o ciudad
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) => setField("city", event.target.value)}
                  className={inputClassName}
                  placeholder="Santiago"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] tracking-[0.22em] uppercase text-black/45">
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={(event) => setField("region", event.target.value)}
                  className={inputClassName}
                  required
                >
                  <option value="">Selecciona una region</option>
                  {chileanRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-black/60">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) => setField("isDefault", event.target.checked)}
                className="h-4 w-4 border-black/20"
              />
              Dejar como direccion predeterminada
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 bg-bloomsy-black px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-bloomsy-cream transition-colors hover:bg-bloomsy-gray disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  Guardar direccion
                </>
              )}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
