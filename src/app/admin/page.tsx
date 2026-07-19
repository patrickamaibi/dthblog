import Image from "next/image";
import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/sanity/adminQueries";
import { deletePost } from "@/lib/actions/posts";

export default async function AdminDashboard() {
  const posts = await getAllPostsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">All posts</h1>

      {posts.length === 0 ? (
        <p className="text-slate-500">
          No posts yet.{" "}
          <Link href="/admin/posts/new" className="text-blue-600 hover:underline">
            Create your first one
          </Link>
          .
        </p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post: any) => (
                <tr key={post._id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {post.coverImageUrl && (
                        <div className="relative w-12 h-9 rounded-md overflow-hidden shrink-0">
                          <Image src={post.coverImageUrl} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900 line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{post.category ?? "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{post.author ?? "-"}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/posts/${post._id}/edit`} className="text-blue-600 hover:underline">
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post._id);
                        }}
                      >
                        <button type="submit" className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
