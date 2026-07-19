"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("dth-cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("dth-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("dth-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed bottom-0 left-0 right-0 z-50 bg-primary dark:bg-gray-900 text-white px-6 py-4 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <p className="text-sm text-blue-100 max-w-2xl">
          🍪 We use cookies to improve your experience. By continuing to browse, you agree to our{" "}
          <button
            onClick={() => setShowPrivacy(true)}
            className="underline text-blue-300 hover:text-blue-200 transition-colors"
          >
            Privacy Policy
          </button>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2 rounded-lg border border-blue-400/40 text-blue-200 text-sm hover:bg-blue-800 transition-all"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition-all"
          >
            Accept
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl">
              <h2 className="text-xl font-bold text-primary dark:text-white">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close privacy policy"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="px-6 py-6 text-sm text-slate-600 dark:text-slate-300 space-y-5 leading-relaxed">
              <p className="text-xs text-slate-400 font-mono">Last updated: July 2026</p>
              {[
                ["1. Introduction", "DiscoveryTech Hub (\"we\", \"us\", or \"our\") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit blog.discoverytechhub.com."],
                ["2. Information We Collect", "We may collect personal information you provide directly, including your name and email address when you subscribe to our newsletter or submit enquiries."],
                ["3. How We Use Your Information", "We use the information we collect to send you content you've requested, respond to enquiries, and improve our website experience."],
                ["4. Cookies", "We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us understand how visitors interact with our site. You may decline cookies, though some features may not function properly."],
                ["5. Data Sharing", "We do not sell, trade, or rent your personal information to third parties."],
                ["6. Contact Us", "If you have questions about this Privacy Policy, please contact us at info@discoverytechhub.com."],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 className="font-semibold text-primary dark:text-white mb-1">{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowPrivacy(false)}
                className="px-6 py-2 bg-primary dark:bg-blue-700 text-white rounded-full text-sm font-semibold hover:bg-blue-900 dark:hover:bg-blue-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
