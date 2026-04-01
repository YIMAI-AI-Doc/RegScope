const emailAuthEnabled = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

const placeholderEmailConfig = {
  server: process.env.EMAIL_SERVER ?? "",
  from: process.env.EMAIL_FROM ?? "RegScope <noreply@regscope.local>",
};

export function getAuthSecret() {
  return process.env.NEXTAUTH_SECRET ?? "regscope-dev-secret";
}

export function getIngestSecret() {
  return process.env.REGSCOPE_INGEST_SECRET ?? getAuthSecret();
}

export { emailAuthEnabled };
export { placeholderEmailConfig };

