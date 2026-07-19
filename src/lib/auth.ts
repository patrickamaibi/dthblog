export const ADMIN_SESSION_COOKIE = "dth_admin_session";

export async function getExpectedSessionValue(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD env var is not set.");
  }
  const enc = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
