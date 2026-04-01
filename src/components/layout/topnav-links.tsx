"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

type TopnavLinksProps = {
  items: readonly NavItem[];
};

export function TopnavLinks({ items }: TopnavLinksProps) {
  const pathname = usePathname() || "/";

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link key={item.href} href={item.href} className={active ? "active" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
