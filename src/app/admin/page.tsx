import Image from "next/image";
import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/sanity/adminQueries";
import { deletePost } from "@/lib/actions/posts";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const posts = await getAllPostsForAdmin();
  const { created, updated } = await searchParams;

  return (
    <div>
      {(created || updated) && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {created ? "✓ Post published successfully" : "✓ Post updated successfully"}
        </div>
      )}

      <h1 className="text-2xl font-bold text-slate-900 mb-4">All posts</h1>

      <div className="mb-6">
        <Link
          href="/admin/posts/new"
          className="inline-block rounded-lg bg-slate-900 text-white px-3.5 py-1.5 text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">
          No posts yet.{" "}
          <Link href="/admin/posts/new" className="text-blue-600 hover:underline">
            Create your first one
          </Link>
          .
        </p>
      ) : (
        <>
          {/* Table view — md and up */}
          <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
                        {post.status === "draft" && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 shrink-0">
                            Draft
                          </span>
                        )}
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

          {/* Card view — below md */}
          <div className="md:hidden space-y-3">
            {posts.map((post: any) => (
              <div key={post._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3 mb-3">
                  {post.coverImageUrl && (
                    <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
                      <Image src={post.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900 leading-snug">{post.title}</span>
                    {post.status === "draft" && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-500 mb-4">
                  <div>
                    <dt className="inline font-medium text-slate-400">Category: </dt>
                    <dd className="inline text-slate-600">{post.category ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-slate-400">Author: </dt>
                    <dd className="inline text-slate-600">{post.author ?? "-"}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="inline font-medium text-slate-400">Published: </dt>
                    <dd className="inline text-slate-600">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-sm">
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}