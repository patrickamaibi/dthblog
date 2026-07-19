import Image from "next/image";
import { Code2, Palette, TrendingUp, Target, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About DiscoveryTech Hub Blog",
  description: "Who we are, what we write, and why it matters.",
};

const COVERAGE = [
  {
    icon: Code2,
    title: "Engineering",
    description: "Architecture, performance, tooling — the technical decisions that hold up under real traffic.",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Design systems, UX research, and accessible interfaces built for real people, not portfolios.",
  },
  {
    icon: TrendingUp,
    title: "Digital Transformation",
    description: "What it actually costs and what it actually achieves for Nigerian SMEs — no inflated promises.",
  },
  {
    icon: Target,
    title: "Product Strategy",
    description: "The decisions that shape how software gets built, shipped, and kept alive after launch.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ---------- Hero — background image, text spread across full width ---------- */}
      <section className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44]/95 via-[#0A1F44]/85 to-[#1A4FD6]/75" />
        </div>

        <div className="mx-auto max-w-6xl px-6 sm:px-8 dth-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
            {/* Left: kicker + headline */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px w-10 bg-white/50" />
                <span className="font-mono text-xs tracking-widest uppercase text-white/70">
                  § About
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Engineers first.{" "}
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Writers second.
                </span>
              </h1>
            </div>

            {/* Right: description + facts, so text isn't bunched left/center */}
            <div>
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8">
                We're a collective of engineers, designers, and strategists building
                the next generation of digital infrastructure in Nigeria and across Africa.
              </p>
              <div className="grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-5">
                <div className="pr-4">
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-1">
                    Based in
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Abuja, Nigeria
                  </p>
                </div>
                <div className="px-4">
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-1">
                    Reach
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Africa &amp; beyond
                  </p>
                </div>
                <div className="pl-4">
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/50 mb-1">
                    Focus
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Product &amp; engineering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-24 pb-28">
        {/* ---------- About DiscoveryTech Hub ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-28 dth-fade-in-up dth-delay-1">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1000&q=80"
              alt="The DiscoveryTech Hub team at work"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
              § DiscoveryTech Hub
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white mb-4">
              The company behind the blog
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-4">
              DiscoveryTech Hub is a digital product studio based in Abuja, Nigeria.
              We believe technology is the most powerful lever for scale available
              to African businesses — so we bridge the gap between creative vision
              and robust engineering, delivering products that are not only
              beautiful but genuinely resilient.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-8">
              We work with businesses across Africa and beyond to design, build,
              and launch high-quality software products and digital experiences.
              This blog is one part of that work — everything else lives on our
              main site.
            </p>
            <a
              href="https://discoverytechhub.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3
                text-sm font-semibold text-white shadow-lg shadow-accent/25
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
            >
              Learn more about DiscoveryTech Hub
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* ---------- About This Blog ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-24 dth-fade-in-up dth-delay-2">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
              § This Blog
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white mb-4">
              Real thinking from real product teams
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-4">
              This publication exists to share our learnings, document our processes,
              and contribute to the growing body of knowledge around software
              engineering and digital transformation in emerging markets.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-8">
              Expect sharp, useful, technically grounded material — written by the
              people actually building the work.{" "}
              <strong className="text-primary dark:text-white">No filler. No generic templates.</strong>
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
            <Image
              src="https://images.unsplash.com/photo-1761322572550-967ea8c0bfd9?auto=format&fit=crop&w=1000&q=80"
              alt="Notes and drafts behind the blog's writing process"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>

        {/* ---------- What We Cover ---------- */}
        <div className="dth-fade-in-up dth-delay-3">
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
            § What We Cover
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white mb-8">
            Four beats, one standard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COVERAGE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`dth-fade-in-up dth-delay-${i + 4} group rounded-2xl border border-border bg-card p-6 shadow-sm
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/40`}
                >
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl
                      bg-accent/10 text-accent transition-all duration-300
                      group-hover:bg-accent group-hover:text-white group-hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dth-fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dth-fade-in-up {
          animation: dth-fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .dth-delay-1 { animation-delay: 0.05s; }
        .dth-delay-2 { animation-delay: 0.1s; }
        .dth-delay-3 { animation-delay: 0.15s; }
        .dth-delay-4 { animation-delay: 0.2s; }
        .dth-delay-5 { animation-delay: 0.25s; }
      `}</style>
    </main>
  );
}