import React from "react";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <section className="site-footer-brand" aria-label="RegScope 平台介绍">
            <p className="site-footer-logo">RegScope</p>
            <p className="site-footer-description">
              面向医药与医疗器械监管团队的情报平台，聚合全球监管政策、来源更新与讨论结论，帮助团队更快定位关键变化与执行重点。
            </p>
            <div className="site-footer-tags">
              <span>政策情报</span>
              <span>来源追踪</span>
              <span>讨论问答</span>
            </div>
          </section>

          <section aria-label="平台导航">
            <h2 className="site-footer-title">平台导航</h2>
            <ul className="site-footer-links">
              <li><Link href="/feed">情报搜索</Link></li>
              <li><Link href="/topics">领域订阅</Link></li>
              <li><Link href="/discussions">讨论问答</Link></li>
              <li><Link href="/sources">官方来源</Link></li>
            </ul>
          </section>

          <section aria-label="合规与支持">
            <h2 className="site-footer-title">合规与支持</h2>
            <ul className="site-footer-links">
              <li>
                <Link href="/legal/privacy">隐私政策</Link>
              </li>
              <li>
                <Link href="/legal/terms">服务条款</Link>
              </li>
              <li>
                <a href="mailto:support@regscope.local">support@regscope.local</a>
              </li>
            </ul>
          </section>
        </div>

        <div className="site-footer-bottom">
          <p>© {year} RegScope. All rights reserved.</p>
          <p>ICP备案号：待补充 ｜ 公网安备号：待补充</p>
        </div>
      </div>
    </footer>
  );
}
