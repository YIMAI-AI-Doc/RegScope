import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RegScope",
  description: "全球医药监管情报平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand">
              <span className="brand-mark">R</span>
              <div>
                <p className="brand-name">RegScope</p>
                <p className="brand-tag">全球医药监管情报平台</p>
              </div>
            </div>
            <nav className="topnav" aria-label="主导航">
              <a href="/">首页</a>
              <a href="/feed">情报快讯</a>
              <a href="/topics">领域订阅</a>
              <a href="/sources">官方来源</a>
              <a href="/countries">国家地区</a>
              <a href="/discussions">讨论问答</a>
              <a href="/me/follows">我的关注</a>
            </nav>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
