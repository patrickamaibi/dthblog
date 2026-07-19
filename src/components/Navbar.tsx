"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Menu, X } from "lucide-react";

// ───────────────────────────────────────────
// Icons
// ───────────────────────────────────────────
const SunIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4.5" />
    <line x1="12" y1="2" x2="12" y2="4.5" /><line x1="12" y1="19.5" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4.5" y2="12" /><line x1="19.5" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" /><line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" /><line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79z" />
  </svg>
);

const MonitorIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

// ───────────────────────────────────────────
// ThemeToggle — dropdown matching reference site
// ───────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const options = [
    { value: "light",  label: "Light",  Icon: SunIcon },
    { value: "dark",   label: "Dark",   Icon: MoonIcon },
    { value: "system", label: "System", Icon: MonitorIcon },
  ];

  const active = options.find((o) => o.value === theme) ?? options[2];

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle theme"
        className="p-2 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-300"
      >
        <active.Icon className="w-[22px] h-[22px]" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setTheme(opt.value as any); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                theme === opt.value
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className={theme === opt.value ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}>
                <opt.Icon className="w-4 h-4" />
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────
// Navbar
// ───────────────────────────────────────────
const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/category",   label: "Topics" },
  { href: "/about",      label: "About" },
  { href: "/search",     label: "Search" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => { setIsOpen(false); }, [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-gray-800">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center max-w-7xl">
        {/* Logo — always the light-mode mark, regardless of theme */}
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2.5">
          {mounted ? (
            <img
              src="/logonav.png"
              alt="DiscoveryTech Hub"
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          )}
          <span className="font-mono text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
            BLOG
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-7 items-center font-medium text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === link.href
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://discoverytechhub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-primary dark:bg-blue-700 text-white rounded-full text-sm hover:bg-blue-900 dark:hover:bg-blue-600 transition-colors shadow-sm"
          >
            Main Site ↗
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="p-2 text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 z-50 px-6 py-6 overflow-y-auto">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-4 text-base font-medium border-b border-slate-100 dark:border-gray-800 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  pathname === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6">
              <a
                href="https://discoverytechhub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 text-center bg-primary dark:bg-blue-700 text-white rounded-full font-semibold text-base hover:bg-blue-900 transition-colors"
              >
                Visit Main Site ↗
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}