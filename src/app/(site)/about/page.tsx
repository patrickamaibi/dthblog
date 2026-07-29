import Image from "next/image";
import { Bot, Palette, TrendingUp, Link2, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About DiscoveryTech Hub Blog",
  description: "Who we are, what we write, and why it matters.",
};

const COVERAGE = [
  {
    icon: Bot,
    title: "AI & AI Automation",
    description: "Practical AI adoption and automation workflows for teams that want results, not hype.",
  },
  {
    icon: Palette,
    title: "Branding",
    description: "Identity, positioning, and visual systems that make businesses memorable and trusted.",
  },
  {
    icon: TrendingUp,
    title: "Digital Strategy",
    description: "What it actually costs and what it actually achieves for Nigerian SMEs. No inflated promises.",
  },
  {
    icon: Link2,
    title: "Blockchain",
    description: "Clear-eyed looks at blockchain and Web3, past the noise, at what's actually useful.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Practical security guidance for businesses and individuals navigating a riskier web.",
  },
  {
    icon: GraduationCap,
    title: "ICT Training",
    description: "Skills, tools, and know-how to help people grow into the digital economy.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero4.png"
            alt="DiscoveryTech Hub Blog"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F44]/95 via-[#0A1F44]/85 to-[#1A4FD6]/75" />
        </div>

        <div className="mx-auto max-w-6xl px-6 sm:px-8 dth-fade-in-up">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-10 bg-white/50" />
            <span className="font-mono text-xs tracking-widest uppercase text-white/70">
              § About
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            Tech Insights
            <br />
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              That Matter.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
            A blog covering AI and automation, branding, digital strategy, blockchain,
            cybersecurity, and ICT training, written for anyone building something
            worth building.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-24 pb-28">
        {/* ---------- About DiscoveryTech Hub ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-28 dth-fade-in-up dth-delay-1">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border order-2 lg:order-1">
            <Image
              src="/image1.jpg"
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
              Who we are
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-4">
              DiscoveryTech Hub is a premier ICT solutions company operating at the
              intersection of technology, creativity, and education, dedicated to
              driving digital transformation for businesses, organizations, and
              individuals.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-8">
              Our team of passionate professionals brings deep expertise across
              multiple digital disciplines, including software development, IT
              consulting, digital marketing, and tech education. This blog is one
              part of that work; everything else lives on our main site.
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
              Updates, thoughts, and know-how from the field
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-4">
              This publication is where DiscoveryTech Hub shares updates, thoughts,
              tips, and know-how on the subjects shaping the modern digital
              economy: AI and AI automation, branding, digital strategy,
              blockchain, cybersecurity, ICT training, and other tech-related
              topics.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-8">
              Expect sharp, useful, technically grounded material, written by the
              people actually building the work.{" "}
              <strong className="text-primary dark:text-white">No filler. No generic templates.</strong>
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
            <Image
              src="/dth11.png"
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
            Six beats, one standard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        .dth-delay-6 { animation-delay: 0.3s; }
        .dth-delay-7 { animation-delay: 0.35s; }
        .dth-delay-8 { animation-delay: 0.4s; }
        .dth-delay-9 { animation-delay: 0.45s; }
      `}</style>
    </main>
  );
}