"use client";

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";

const SEEN_KEY = "dth-newsletter-intro-shown";
const AUTO_OPEN_DELAY_MS = 2000;

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(true); // default true to avoid SSR flash of pulse

  // On first mount (client only), check whether this visitor has ever
  // seen the popup. If not, auto-open it once after a short delay so
  // people learn what the floating envelope icon means.
  useEffect(() => {
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      setHasSeenIntro(false);
      const timer = setTimeout(() => {
        setOpen(true);
      }, AUTO_OPEN_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  function markIntroSeen() {
    localStorage.setItem(SEEN_KEY, "true");
    setHasSeenIntro(true);
  }

  function close() {
    setOpen(false);
    markIntroSeen();
    // Reset submitted state after the close animation would finish, so the
    // form is fresh next time the icon is clicked.
    setTimeout(() => {
      setSubmitted(false);
      setError(false);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);
    setError(false);

    try {
      const res = await fetch("https://formsubmit.co/ajax/disctechhub@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          _subject: "New Newsletter Signup - DiscoveryTech Hub Blog (Popup)",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
      setEmail("");
      markIntroSeen();
      setTimeout(close, 1800);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ---------- Floating trigger icon ---------- */}
      <button
        onClick={() => {
          setOpen(true);
          markIntroSeen();
        }}
        aria-label="Subscribe to newsletter"
        className="fixed right-5 bottom-5 sm:right-8 sm:bottom-8 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-lg shadow-accent/30 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300"
      >
        {/* Pulsing ring — only visible until the visitor has interacted
            with the popup for the first time. Draws the eye without
            being permanently distracting. */}
        {!hasSeenIntro && (
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
        )}
        <Mail className="relative w-5 h-5" />
      </button>

      {/* ---------- Modal ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-primary/40 dark:bg-black/60 backdrop-blur-sm dth-fade-in"
            onClick={close}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-accent/20 p-8 dth-popup-in overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/20 blur-[80px]" />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary dark:hover:text-white hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!submitted ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                  Get new posts in your inbox
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  One email whenever we publish, no spam, unsubscribe anytime.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={submitting}
                    className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70"
                  >
                    {submitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
                {error && (
                  <p className="text-red-500 mt-3 text-xs text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-lg font-semibold text-primary dark:text-white mb-1">You&apos;re in 🎉</p>
                <p className="text-sm text-muted-foreground">Thanks for subscribing.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}