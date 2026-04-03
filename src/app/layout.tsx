import React from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextDevtoolsLocalizer } from "@/components/devtools/next-devtools-localizer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "药宇纵观 | RegScope",
  description: "药宇纵观：全球医药监管情报平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <NextDevtoolsLocalizer />
        <div className="app-shell">
          <SiteHeader />
          <main className="app-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
