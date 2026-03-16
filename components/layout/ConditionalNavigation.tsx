"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface Props {
  nav: ReactNode;
  footer: ReactNode;
  banner: ReactNode;
  modal: ReactNode;
  children: ReactNode;
}

export default function ConditionalNavigation({
  nav,
  footer,
  banner,
  modal,
  children,
}: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {banner}
      {nav}
      <main className="flex-1">{children}</main>
      {footer}
      {modal}
    </>
  );
}
