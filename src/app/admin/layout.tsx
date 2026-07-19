import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="font-bold text-slate-900">
            DTH Blog Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              Posts
            </Link>
            <Link
              href="/admin/posts/new"
              className="rounded-lg bg-slate-900 text-white px-3.5 py-1.5 font-medium hover:bg-slate-800 transition-colors"
            >
              + New post
            </Link>
            <form action={logout}>
              <button type="submit" className="text-slate-500 hover:text-slate-900">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
