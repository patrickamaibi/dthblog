import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, getExpectedSessionValue } from "@/lib/auth";

async function login(formData: FormData) {
  "use server";

  const submitted = formData.get("password")?.toString() ?? "";
  const correct = submitted === process.env.ADMIN_PASSWORD;

  if (!correct) {
    redirect("/admin/login?error=1");
  }

  const expected = await getExpectedSessionValue();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-1">DTH Blog Admin</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to manage posts.</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            Incorrect password. Try again.
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}