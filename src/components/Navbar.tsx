"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category", label: "Topics" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = React.useState({ top: 0, right: 0 });

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-theme-dropdown]")) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const toggleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  };

  const options = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Monitor },
  ];

  const active = options.find((o) => o.value === theme) ?? options[2];

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <div data-theme-dropdown>
      <button
        ref={btnRef}
        onClick={toggleOpen}
        aria-label="Toggle theme"
        className="p-2 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-300"
      >
        <active.Icon className="w-[22px] h-[22px]" />
      </button>

      {open &&
        createPortal(
          <div
            data-theme-dropdown
            style={{ position: "fixed", top: coords.top, right: coords.right }}
            className="w-44 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl z-[9999] overflow-hidden py-1"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value as any);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  theme === opt.value
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800"
                }`}
              >
                <opt.Icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => setIsOpen(false), [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-gray-800">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center max-w-7xl">
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2.5">
          {mounted ? (
            <Image
              src="/logonav.png"
              alt="DiscoveryTech Hub"
              width={140}
              height={36}
              priority
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="h-9 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          )}
          <span className="font-mono text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5">
            BLOG
          </span>
        </Link>

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
          <a href="https://discoverytechhub.com" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-primary dark:bg-blue-700 text-white rounded-full text-sm hover:bg-blue-900 dark:hover:bg-blue-600 transition-colors shadow-sm">
            Main Site
          </a>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="p-2 text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mounted &&
        isOpen &&
        createPortal(
          <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 z-[9999] px-6 py-6 overflow-y-auto">
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
                <a href="https://discoverytechhub.com" target="_blank" rel="noopener noreferrer" className="block w-full py-3 text-center bg-primary dark:bg-blue-700 text-white rounded-full font-semibold text-base hover:bg-blue-900 transition-colors">
                  Visit Main Site
                </a>
              </div>
            </nav>
          </div>,
          document.body
        )}
    </header>
  );
}