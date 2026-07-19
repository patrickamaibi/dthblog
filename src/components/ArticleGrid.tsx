import Image from "next/image";
import Link from "next/link";
import { POSTS, CATEGORIES, formatDate } from "@/lib/data";
import {
  ArrowRight,
  Bot,
  Palette,
  ShieldCheck,
  Compass,
  GraduationCap,
  Folder,
  Hash,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

// Maps each category slug to a representative icon.
// Falls back to a generic folder icon for any category not listed here.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "ai-automation": Bot,
  branding: Palette,
  security: ShieldCheck,
  "digital-strategy": Compass,
  "ict-training": GraduationCap,
};

// Custom brand marks — lucide-react removed Facebook/Instagram/LinkedIn/TikTok
// icons from its published exports (trademark policy), so these are defined
// locally instead of relying on the library.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.86.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.008c-.783 0-1.398.212-1.822.665-.424.454-.63 1.187-.63 2.211v1.113h3.588l-.545 3.667h-3.043v7.98H9.101Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com/discoverytechhub", icon: InstagramIcon },
  { name: "Facebook", href: "https://facebook.com/discoverytechhub", icon: FacebookIcon },
  { name: "LinkedIn", href: "https://linkedin.com/company/discoverytechhub", icon: LinkedinIcon },
  { name: "TikTok", href: "https://tiktok.com/@discoverytechhub", icon: TikTokIcon },
];

/** Aggregates tag frequency across all posts and returns the most-used tags. */
function getPopularTags(limit = 10) {
  const counts = new Map<string, { title: string; slug: string; count: number }>();

  for (const post of POSTS) {
    for (const tag of post.tags) {
      const existing = counts.get(tag.slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(tag.slug, { title: tag.title, slug: tag.slug, count: 1 });
      }
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, limit);
}

/** Small reusable section header: mono kicker + gradient-accented headline. */
function SectionHeader({
  kicker,
  title,
  accentWord,
}: {
  kicker: string;
  title: string;
  accentWord?: string;
}) {
  const parts = accentWord ? title.split(accentWord) : [title];

  return (
    <div className="mb-10 dth-fade-in-up opacity-0">
      <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
        <span className="text-accent">§</span> {kicker}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary dark:text-white">
        {accentWord ? (
          <>
            {parts[0]}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary dark:to-white">
              {accentWord}
            </span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
    </div>
  );
}

export default function ArticleGrid() {
  const sorted = [...POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Top 3 = featured (with imagery).
  const featured = sorted.slice(0, 3);
  const popularTags = getPopularTags();

  return (
    <section className="relative py-20 md:py-28 border-b border-border overflow-hidden">
      <style>{`
        @keyframes dth-fade-in-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .dth-fade-in-up {
          animation: dth-fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .dth-pop {
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease;
        }
        .dth-pop:hover {
          transform: scale(1.045) translateY(-4px);
        }
      `}</style>

      {/* Ambient blurred backdrop, echoing the Hero's blue glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-[24rem] w-[24rem] rounded-full bg-[#1A4FD6]/15 blur-[130px]" />
        <div className="absolute bottom-0 -right-32 h-[26rem] w-[26rem] rounded-full bg-[#0A1F44]/15 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Featured articles */}
        <SectionHeader
          kicker="Featured stories"
          title="Our latest deep dives"
          accentWord="deep dives"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {featured.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card dth-fade-in-up opacity-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/[0.12] hover:border-accent/30"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt}
                  fill
                  priority={i === 0}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase bg-accent text-white px-2.5 py-1 rounded-full shadow-lg shadow-accent/30">
                  Featured
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="font-mono text-muted-foreground">{post.category.title}</span>
                  <span className="text-muted-foreground">•</span>
                  <time dateTime={post.publishedAt} className="font-mono text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                <h3 className="text-lg font-bold text-primary dark:text-white leading-snug group-hover:text-accent transition-colors mb-2">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                  Read <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore by category — the grid ends with a 6th "Browse All Topics"
            card so the CTA lives inside the grid instead of below it. */}
        <SectionHeader
          kicker="Explore by category"
          title="Find what's relevant to your business"
          accentWord="relevant"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {CATEGORIES.map((category, i) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Folder;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative rounded-2xl border border-border bg-card p-8 overflow-hidden dth-fade-in-up opacity-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/[0.1]"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {/* Soft accent wash on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 ring-1 ring-accent/10 text-accent mb-6 transition-all duration-300 group-hover:scale-110 group-hover:from-accent group-hover:to-accent group-hover:text-white group-hover:ring-accent/0 group-hover:shadow-lg group-hover:shadow-accent/30">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-primary dark:text-white leading-snug mb-2.5 transition-colors group-hover:text-accent">
                    {category.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {category.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                    View articles
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* 6th card: image-backed "Browse All Topics" CTA, with a bouncy
              pop-out hover instead of the flat lift used on the other cards. */}
          <Link
            href="/category"
            className="dth-pop group relative flex flex-col items-center justify-center text-center rounded-2xl border border-border overflow-hidden min-h-[280px] dth-fade-in-up opacity-0 hover:shadow-2xl hover:shadow-accent/30"
            style={{ animationDelay: `${CATEGORIES.length * 90}ms` }}
          >
            <Image
              src="https://picsum.photos/seed/dth-browse-all-topics/800/600"
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/40 group-hover:from-accent group-hover:via-accent/75 transition-colors duration-300" />

            <div className="relative z-10 flex flex-col items-center px-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 text-white mb-5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                <LayoutGrid className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-1.5">
                Browse All Topics
              </h3>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/85 group-hover:text-white transition-colors">
                See everything we've published
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Follow us / social */}
        <SectionHeader kicker="Follow us" title="Stay connected beyond the blog" />

        <div
          className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden dth-fade-in-up opacity-0"
          style={{ animationDelay: "150ms" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent" />

          <p className="relative text-sm text-muted-foreground max-w-md">
            Follow @discoverytechhub for behind-the-scenes updates, quick tips, and
            announcements we don't always turn into full articles.
            {/*
              TODO: Replace this static panel with a live embed once API access
              is set up — e.g. Instagram Basic Display API, or a third-party
              embed widget (SnapWidget, Elfsight, EmbedSocial). Swap this whole
              block for the widget's iframe/script per that provider's docs.
            */}
          </p>

          <div className="relative flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-border text-primary dark:text-white transition-all duration-300 hover:border-accent/40 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/25"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}