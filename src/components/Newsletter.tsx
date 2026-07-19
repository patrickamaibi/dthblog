"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire up to actual newsletter provider/API
    setStatus("submitted");
    setEmail("");
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-jakarta text-primary dark:text-white mb-4 max-w-2xl mx-auto leading-tight">
          Stay updated with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            new articles
          </span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto">
          Subscribe to get the latest insights on web design, ICT training, and branding straight to your inbox.
        </p>

        {status === "submitted" ? (
          <p className="text-blue-600 dark:text-blue-400 font-semibold">
            Thanks for subscribing — check your inbox to confirm.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full sm:flex-1 px-5 py-4 rounded-full border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary dark:text-white placeholder:text-slate-400 focus-visible:outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-primary dark:bg-blue-700 text-white rounded-full font-bold hover:bg-blue-900 dark:hover:bg-blue-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}