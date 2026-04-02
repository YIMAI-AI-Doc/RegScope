import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "服务条款 | RegScope",
  description: "RegScope 服务条款",
};

export default function TermsOfServicePage() {
  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gap: "22px" }}>
      <header style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>LEGAL</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.18 }}>服务条款</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.72 }}>
          最近更新：2026 年 4 月 2 日
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>1. 条款适用</h2>
        <p style={paragraphStyle}>
          欢迎使用 RegScope。访问或使用本平台即表示你已阅读并同意本服务条款及相关政策。若你不同意本条款，请停止使用本服务。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>2. 服务内容</h2>
        <p style={paragraphStyle}>
          RegScope 提供医药监管情报检索、来源订阅、讨论问答等功能。我们可基于产品演进调整功能形态、交互方式或可用范围，并将尽量保持核心服务的连续性。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>3. 账户与安全</h2>
        <p style={paragraphStyle}>
          你应确保注册信息真实、准确并及时更新。你需要对账户下的所有操作承担责任。若发现账号被盗用、异常登录或其他安全风险，请立即联系我们处理。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>4. 用户行为规范</h2>
        <p style={paragraphStyle}>
          你不得利用平台从事违法违规活动，不得上传或传播侵权、恶意、误导性内容，不得干扰平台正常运行。平台有权对违规内容采取删除、限制功能或终止服务等措施。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>5. 知识产权</h2>
        <p style={paragraphStyle}>
          平台页面、结构、文本与技术实现受法律保护。未经授权，不得复制、抓取、镜像或用于与本服务竞争的商业用途。你提交的内容仍归你或权利人所有，但你授予平台为提供服务所需的使用授权。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>6. 免责声明与责任限制</h2>
        <p style={paragraphStyle}>
          平台内容用于信息参考，不构成法律、医疗或监管合规建议。你应结合自身场景进行独立判断。对于因网络故障、第三方服务异常或不可抗力导致的中断，我们将尽力恢复，但不承担超出法律规定范围的责任。
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>7. 条款更新与联系</h2>
        <p style={paragraphStyle}>
          我们可根据法律法规与业务变化更新本条款。更新后在本页公示并立即生效。若你继续使用服务，视为接受更新后的条款。联系邮箱：
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
