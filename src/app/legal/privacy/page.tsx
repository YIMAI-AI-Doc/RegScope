import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "隐私政策 | RegScope",
  description: "RegScope 隐私政策",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gap: "22px" }}>
      <header style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>LEGAL</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.18 }}>隐私政策</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.72 }}>
          最近更新：2026 年 4 月 2 日
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>1. 我们收集的信息</h2>
        <p style={paragraphStyle}>
          在你注册、登录、上传头像或使用订阅与讨论功能时，我们会收集必要的账户信息（如邮箱、昵称、头像）以及与你操作相关的日志信息，以保障平台的正常运行与安全审计。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>2. 信息的使用方式</h2>
        <p style={paragraphStyle}>
          我们仅将信息用于提供与优化 RegScope 服务，包括身份验证、内容推荐、订阅同步、异常排查及服务通知。未经你的明确同意，我们不会将你的个人信息用于与本服务无关的商业用途。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>3. 信息存储与安全</h2>
        <p style={paragraphStyle}>
          我们采取访问控制、传输加密和最小权限等安全措施保护数据安全。头像图片会在服务端压缩处理后保存。你应妥善保管账号凭据，如发现异常访问请立即联系我们。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>4. 信息共享与披露</h2>
        <p style={paragraphStyle}>
          除法律法规要求、司法机关依法调取或为保障平台及用户安全必须披露的情形外，我们不会向第三方出售你的个人信息。若未来涉及第三方服务接入，我们会在接入前更新本政策并明确说明。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>5. 你的权利</h2>
        <p style={paragraphStyle}>
          你可以申请访问、更正或删除你的账户资料，并可通过注销或联系我们申请删除相关数据。基于安全与合规要求，部分日志信息可能在法定期限内保留。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. 政策更新与联系</h2>
        <p style={paragraphStyle}>
          我们可能根据业务变化和法律要求更新本政策。更新后将发布在本页面并同步更新“最近更新”日期。若你对本政策有疑问，请联系
          <a href="mailto:support@regscope.local" style={linkStyle}> support@regscope.local</a>。
        </p>
      </section>
    </div>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "18px",
  background: "#fff",
  padding: "18px 20px",
  display: "grid",
  gap: "10px",
};

const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.08rem",
};

const paragraphStyle: CSSProperties = {
  margin: 0,
  color: "var(--muted)",
  lineHeight: 1.75,
};

const linkStyle: CSSProperties = {
  color: "var(--accent)",
  fontWeight: 600,
};
