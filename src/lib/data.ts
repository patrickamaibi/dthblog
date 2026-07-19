export type Author = {
  name: string;
  slug: string;
  role: string;
  initials: string;
  bio: string;
  avatar: string; // 1:1 is fine here — it's a small avatar circle, not a content image
};

export type Category = {
  title: string;
  slug: string;
  description: string;
};

export type Tag = {
  title: string;
  slug: string;
};

export type CoverImage = {
  url: string;
  alt: string;
  // Unsplash source dims are baked into the URL query (?w=...&h=...&fit=crop).
  // Always 16:9 or wider — never 1:1.
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // rich HTML body (stand-in for Sanity portable text -> HTML render)
  publishedAt: string; // ISO
  readTime: number;
  category: Category;
  tags: Tag[];
  author: Author;
  coverImage: CoverImage;
};

export const AUTHORS: Record<string, Author> = {
  patrick: {
    name: "Patrick Amaibi",
    slug: "patrick-amaibi",
    role: "Co-founder, DiscoveryTech Hub",
    initials: "PA",
    bio: "Patrick co-founded DiscoveryTech Hub and writes on digital transformation, ICT strategy, and technology adoption across Nigerian and African businesses.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&q=80",
  },
  dth: {
    name: "DiscoveryTech Hub",
    slug: "discoverytech-hub",
    role: "Editorial Team",
    initials: "DT",
    bio: "The DiscoveryTech Hub editorial team covers ICT training, branding, and practical technology guidance for growing businesses.",
    avatar:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=200&h=200&fit=crop&q=80",
  },
};

export const CATEGORIES: Category[] = [
  {
    title: "AI & Automation",
    slug: "ai-automation",
    description:
      "Practical AI agents and automation tools for lean teams — what's worth adopting and what's hype.",
  },
  {
    title: "Branding",
    slug: "branding",
    description:
      "Building a consistent, recognisable brand across every customer touchpoint.",
  },
  {
    title: "Security",
    slug: "security",
    description:
      "Straightforward cybersecurity guidance for small and mid-sized businesses.",
  },
  {
    title: "Digital Strategy",
    slug: "digital-strategy",
    description:
      "Web presence, positioning, and the digital fundamentals every growing business needs.",
  },
  {
    title: "ICT Training",
    slug: "ict-training",
    description:
      "Getting real return from team training instead of one-off workshops.",
  },
  {
    title: "Web3",
    slug: "web3",
    description:
      "Blockchain, tokens, and decentralized tools — separating genuine utility from speculation.",
  },
  {
    title: "Others",
    slug: "others",
    description:
      "Everything worth sharing that doesn't fit neatly into a single category.",
  },
];

// Internal lookup used only inside this file to keep POSTS entries in sync
// with the single source of truth above.
const catBySlug = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<string, Category>;

const TAGS = {
  ai: { title: "AI", slug: "ai" },
  automation: { title: "Automation", slug: "automation" },
  sme: { title: "SMEs", slug: "sme" },
  nigeria: { title: "Nigeria", slug: "nigeria" },
  branding: { title: "Branding", slug: "branding" },
  webdesign: { title: "Web Design", slug: "web-design" },
  security: { title: "Security", slug: "security" },
  startups: { title: "Startups", slug: "startups" },
  training: { title: "Training", slug: "training" },
  strategy: { title: "Strategy", slug: "strategy" },
  blockchain: { title: "Blockchain", slug: "blockchain" },
  web3: { title: "Web3", slug: "web3" },
  compliance: { title: "Compliance", slug: "compliance" },
  seo: { title: "SEO", slug: "seo" },
  mentorship: { title: "Mentorship", slug: "mentorship" },
  remote: { title: "Remote Work", slug: "remote-work" },
  culture: { title: "Culture", slug: "culture" },
} satisfies Record<string, Tag>;

export const POSTS: Post[] = [
  {
    slug: "ai-automation-tools-african-businesses",
    title: "The Rise of AI Automation Tools for African Businesses",
    excerpt:
      "From customer support to invoicing, a new wave of AI agents is quietly reshaping how small and mid-sized African businesses operate. Here's what's actually worth adopting in 2026.",
    content: `
      <p>Across Lagos, Abuja, and Nairobi, a quiet shift is underway. Business owners who once dismissed automation as something only large enterprises could afford are now running lean operations powered by AI agents that handle bookings, respond to customer queries, and flag issues before they become problems.</p>
      <h2>Why now</h2>
      <p>The tooling has matured to the point where deployment no longer requires an in-house engineering team. A single integration, properly configured, can absorb work that used to require two or three support staff.</p>
      <h2>Where to start</h2>
      <p>The businesses seeing the best results aren't the ones automating everything at once. They're picking one repetitive, well-defined workflow — appointment confirmations, FAQ responses, lead qualification — and getting that right before expanding.</p>
      <blockquote>Automation should remove drudgery, not remove the human judgment that makes a business trustworthy.</blockquote>
      <p>For most SMEs, the right entry point is a messaging-based assistant on WhatsApp or Telegram, since that's where customers already are.</p>
      <h2>What to watch out for</h2>
      <p>The most common failure mode isn't the technology — it's rolling out an agent with no clear escalation path. Customers tolerate automation when a human is one step away; they abandon a business the moment the bot becomes a wall. Build the handoff before you build the automation.</p>
    `,
    publishedAt: "2026-06-18T09:00:00.000Z",
    readTime: 7,
    category: catBySlug["ai-automation"],
    tags: [TAGS.ai, TAGS.automation, TAGS.sme, TAGS.nigeria],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=823&fit=crop&q=80",
      alt: "Close-up of an AI-assisted workspace with a laptop screen showing automated data workflows",
    },
  },
  {
    slug: "cybersecurity-basics-small-business-nigeria",
    title: "Cybersecurity Basics Every Small Business Owner in Nigeria Should Know",
    excerpt:
      "Most successful attacks on small businesses don't involve sophisticated hacking — they involve a weak password and an unpatched plugin. Here's where to focus first.",
    content: `
      <p>When people picture a cyberattack, they usually imagine something dramatic. In practice, the businesses we work with are far more likely to lose money to a reused password or an out-of-date WordPress plugin than to a targeted breach.</p>
      <h2>The unglamorous fundamentals</h2>
      <p>Two-factor authentication on email and admin accounts, a password manager instead of memorized (and reused) passwords, and a habit of updating software promptly close off the vast majority of realistic risk.</p>
      <h2>Backups are not optional</h2>
      <p>A working, tested backup is the difference between a bad afternoon and a business-ending event. Set a recurring reminder to actually verify a restore, not just that a backup file exists.</p>
      <h2>Training your team costs less than an incident</h2>
      <p>Most breaches at small businesses start with a phishing email, not a technical exploit. A short, recurring reminder of what a suspicious link looks like does more to protect a business than any single piece of software.</p>
    `,
    publishedAt: "2026-06-05T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["security"],
    tags: [TAGS.security, TAGS.sme, TAGS.nigeria],
    author: AUTHORS.patrick,
    coverImage: {
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=823&fit=crop&q=80",
      alt: "Server room with rows of illuminated data racks representing IT infrastructure security",
    },
  },
  {
    slug: "why-nigerian-startups-need-a-website-2026",
    title: "Why Every Nigerian Startup Still Needs a Real Website in 2026",
    excerpt:
      "Instagram and WhatsApp Business get you discovered. A proper website is what makes people trust you enough to pay. The two aren't substitutes for each other.",
    content: `
      <p>It's tempting to treat a social media page as a full storefront. It gets you visibility fast, and for a while that feels like enough. But visibility and credibility are different things.</p>
      <h2>What a website does that a profile can't</h2>
      <p>A domain you own, a clear description of what you actually do, and a way to be found on Google when someone searches your name rather than stumbles on a post — none of that depends on an algorithm's mood that day.</p>
      <h2>It doesn't need to be expensive</h2>
      <p>A focused five-page site with clear service pages, real contact information, and decent load speed will outperform a bloated template every time — for a fraction of the cost most founders expect.</p>
      <h2>The trust signal matters more than the traffic</h2>
      <p>Even customers who found you on Instagram will often check for a website before paying anything meaningful. Its job isn't always to generate traffic — it's to confirm, at the moment someone is deciding whether to trust you, that you're a real business.</p>
    `,
    publishedAt: "2026-05-22T09:00:00.000Z",
    readTime: 5,
    category: catBySlug["digital-strategy"],
    tags: [TAGS.webdesign, TAGS.startups, TAGS.strategy],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1920&h=823&fit=crop&q=80",
      alt: "Developer reviewing website layout and code across two monitors",
    },
  },
  {
    slug: "branding-lessons-african-businesses",
    title: "Branding in the Digital Age: Lessons for African Businesses",
    excerpt:
      "A logo isn't a brand. Consistency across every touchpoint — from your invoice template to your Instagram bio — is what actually builds recognition.",
    content: `
      <p>Business owners often come to us after a rebrand has already happened, asking why it hasn't changed anything. Usually the answer is that only the logo changed — nothing else in the customer experience did.</p>
      <h2>Consistency compounds</h2>
      <p>The same color palette, the same tone of voice, the same visual language across your website, your social posts, and your printed materials build recognition slowly, then all at once.</p>
      <h2>Start with a one-page brand guide</h2>
      <p>You don't need a 40-page brand book to get this right. A single page with your colors, fonts, and three sentences on tone of voice is enough to keep everything aligned as your team grows.</p>
      <h2>Revisit it as you scale</h2>
      <p>A brand guide built for a two-person team eventually needs updating once other people are writing captions and designing flyers on your behalf. Treat it as a living document, not a one-time deliverable.</p>
    `,
    publishedAt: "2026-05-08T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["branding"],
    tags: [TAGS.branding, TAGS.strategy],
    author: AUTHORS.patrick,
    coverImage: {
      url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1920&h=823&fit=crop&q=80",
      alt: "Designer arranging brand color swatches and typography samples on a light table",
    },
  },
  {
    slug: "ict-training-roi-growing-teams",
    title: "Understanding ICT Training ROI for Growing Teams",
    excerpt:
      "Training budgets are often the first thing cut and the hardest thing to justify. Here's a simple way to think about what it's actually worth.",
    content: `
      <p>Every growing team eventually asks the same question: is structured ICT training worth the time away from billable work? The honest answer depends on what's currently costing you in avoidable errors and slow onboarding.</p>
      <h2>Measure the gap, not the course</h2>
      <p>The right way to evaluate training isn't the course itself — it's the gap between how long a task currently takes an untrained team member and how long it takes someone who's been shown the efficient way once.</p>
      <h2>Short, focused, repeated</h2>
      <p>Teams retain far more from four focused 90-minute sessions spread over a month than from a single all-day workshop. Plan training the way you'd plan a workout program, not a lecture.</p>
      <h2>Make it someone's job to keep it current</h2>
      <p>Training programs decay the moment nobody owns updating them. Assign one person to revisit the material every quarter, even briefly, so it keeps reflecting the tools your team actually uses.</p>
    `,
    publishedAt: "2026-04-24T09:00:00.000Z",
    readTime: 5,
    category: catBySlug["ict-training"],
    tags: [TAGS.training, TAGS.sme],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=823&fit=crop&q=80",
      alt: "Small group of professionals collaborating around a laptop during a training session",
    },
  },
  {
    slug: "tech-tips-tuesday-productivity-tools",
    title: "Tech Tips Tuesday: Five Tools That Quietly Save Hours Every Week",
    excerpt:
      "Not every productivity win needs a full automation build. Sometimes it's just knowing the right shortcut, extension, or setting exists.",
    content: `
      <p>This week's roundup isn't about the flashy AI tools — it's about the small, unglamorous settings and shortcuts that add up to real time saved.</p>
      <h2>Browser tab management</h2>
      <p>A simple tab-grouping extension eliminates the daily ritual of hunting through twenty open tabs for the one you actually need.</p>
      <h2>Scheduled sends</h2>
      <p>Delaying an email or message send by a few minutes gives you a built-in window to catch mistakes before they land in someone's inbox.</p>
      <h2>Keyboard-first navigation</h2>
      <p>Learning even ten keyboard shortcuts in the tools you use daily removes hundreds of small mouse trips over the course of a week.</p>
      <h2>One more: templated replies</h2>
      <p>If you find yourself typing a similar response more than twice a week, it's worth the five minutes to save it as a template. The habit of reaching for a template instead of retyping compounds faster than most people expect.</p>
    `,
    publishedAt: "2026-04-01T09:00:00.000Z",
    readTime: 4,
    category: catBySlug["ai-automation"],
    tags: [TAGS.automation, TAGS.strategy],
    author: AUTHORS.patrick,
    coverImage: {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0269a1a6?w=1920&h=823&fit=crop&q=80",
      alt: "Overhead view of a tidy desk setup with laptop, notebook, and coffee representing a productive workspace",
    },
  },
  {
    slug: "choosing-your-first-ai-agent-vendor",
    title: "How to Choose Your First AI Agent Vendor Without Getting Locked In",
    excerpt:
      "The AI vendor market is crowded and moving fast. Here's a practical checklist for picking a partner you won't regret in twelve months.",
    content: `
      <p>Every week brings a new AI agent platform promising to handle customer support, scheduling, or sales outreach. For a business making its first serious investment in this space, the harder problem isn't finding a vendor — it's avoiding one that leaves you stuck.</p>
      <h2>Ask about data portability first</h2>
      <p>Before comparing pricing or features, ask how easily your conversation history, customer data, and configurations can be exported if you switch providers later. A vendor that can't answer this clearly is telling you something important.</p>
      <h2>Pilot on a narrow, measurable workflow</h2>
      <p>Resist the temptation to roll a new agent out across your whole support inbox on day one. Pick one workflow with a clear before-and-after metric — average response time, resolution rate — and run it for a month before expanding.</p>
      <h2>Read the escalation logic, not just the demo</h2>
      <p>Demos are built to impress. What matters more is how the agent behaves when it doesn't know the answer — does it guess, stall, or hand off cleanly to a human? That failure mode is what your customers will actually experience.</p>
    `,
    publishedAt: "2026-07-02T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["ai-automation"],
    tags: [TAGS.ai, TAGS.automation, TAGS.strategy],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=1920&h=823&fit=crop&q=80",
      alt: "Team reviewing a vendor comparison chart on a laptop screen in a meeting",
    },
  },
  {
    slug: "rebranding-without-losing-customers",
    title: "Rebranding Without Losing the Customers Who Already Trust You",
    excerpt:
      "A rebrand can easily read as abandonment to the people who supported you first. Here's how to evolve your identity without breaking that trust.",
    content: `
      <p>Founders often approach a rebrand the same way they'd approach a website relaunch — as a clean break. But existing customers didn't sign up for a break; they signed up for the business as it was when they found it.</p>
      <h2>Announce before you switch</h2>
      <p>Give your existing audience a short, honest heads-up before the new look appears everywhere at once. A one-paragraph explanation of why the change is happening does more to preserve trust than any amount of design polish.</p>
      <h2>Keep the parts that built recognition</h2>
      <p>A full reset — new name, new colors, new voice, all at once — reads as a different business entirely. Anchoring the update around one consistent element, whether that's a color, a symbol, or a tone of voice, gives returning customers something familiar to hold onto.</p>
      <h2>Update systematically, not sporadically</h2>
      <p>A rebrand that lingers half-finished across your invoices, social bios, and signage for months looks less like evolution and more like disorganization. Set a firm cutover date and update every touchpoint on the same day.</p>
    `,
    publishedAt: "2026-06-28T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["branding"],
    tags: [TAGS.branding, TAGS.strategy, TAGS.sme],
    author: AUTHORS.patrick,
    coverImage: {
      url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1920&h=823&fit=crop&q=80",
      alt: "Before and after brand identity mockups laid out side by side on a studio table",
    },
  },
  {
    slug: "ndpa-data-protection-checklist-nigeria",
    title: "A Plain-Language NDPA Checklist for Nigerian SMEs",
    excerpt:
      "Data protection compliance sounds like a large-company problem until a customer asks how their information is stored. Here's what actually applies to small businesses.",
    content: `
      <p>Nigeria's Data Protection Act applies well beyond banks and telecoms. Any business collecting customer names, phone numbers, or payment details — which is most of them — has some baseline obligations worth understanding.</p>
      <h2>Know what you're actually collecting</h2>
      <p>Most businesses underestimate how much personal data they hold once you count order forms, WhatsApp chat logs, and spreadsheet-based customer lists. The first real step toward compliance is simply auditing what exists and where it lives.</p>
      <h2>Limit access before you limit anything else</h2>
      <p>Restricting who on your team can view customer data — rather than leaving a shared spreadsheet open to everyone — closes off the most common and least glamorous kind of data exposure.</p>
      <h2>Have a plan before you need one</h2>
      <p>A short written note on what your business would do if customer data were exposed — who gets notified, and how quickly — puts you in a fundamentally different position than a business improvising in the moment.</p>
    `,
    publishedAt: "2026-06-12T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["security"],
    tags: [TAGS.security, TAGS.compliance, TAGS.sme, TAGS.nigeria],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1920&h=823&fit=crop&q=80",
      alt: "Close-up of a hand reviewing a data privacy compliance document at a desk",
    },
  },
  {
    slug: "local-seo-fundamentals-african-businesses",
    title: "Local SEO Fundamentals Most African Businesses Skip",
    excerpt:
      "You don't need a large content team to show up when someone searches for what you offer nearby. A handful of unglamorous basics do most of the work.",
    content: `
      <p>Local search is one of the highest-leverage, lowest-cost channels available to a growing business, and most of it comes down to a handful of details that take an afternoon to set up properly.</p>
      <h2>Claim and complete your Google Business Profile</h2>
      <p>An unclaimed or half-filled profile is the single most common gap. Accurate hours, categories, photos, and a consistent business name across every listing directly affect whether you show up in local results at all.</p>
      <h2>Consistency beats cleverness</h2>
      <p>The exact same business name, address, and phone number across your website, social profiles, and directory listings matters more to search ranking than any clever keyword trick.</p>
      <h2>Reviews are a ranking signal, not just social proof</h2>
      <p>A steady trickle of recent reviews, responded to promptly, tells search engines the business is active — which affects visibility independent of star rating alone.</p>
    `,
    publishedAt: "2026-05-30T09:00:00.000Z",
    readTime: 5,
    category: catBySlug["digital-strategy"],
    tags: [TAGS.seo, TAGS.strategy, TAGS.webdesign],
    author: AUTHORS.patrick,
    coverImage: {
      url: "https://images.unsplash.com/photo-1571677246347-5040036b95cc?w=1920&h=823&fit=crop&q=80",
      alt: "Laptop screen showing a local search results map with pinned business locations",
    },
  },
  {
    slug: "building-internal-tech-mentorship-program",
    title: "Building an Internal Tech Mentorship Program on a Small Budget",
    excerpt:
      "You don't need an external training vendor to level up a growing technical team. A structured internal mentorship program often works better, for less.",
    content: `
      <p>The most consistent complaint we hear from growing teams isn't a lack of training budget — it's that formal training rarely transfers into the specific tools and workflows the team actually uses day to day.</p>
      <h2>Pair, don't lecture</h2>
      <p>A senior team member spending 30 focused minutes a week reviewing a junior colleague's actual work produces more durable improvement than a quarterly workshop, because the feedback is tied directly to real output.</p>
      <h2>Make mentorship visible, not informal</h2>
      <p>Ad hoc mentoring quietly falls apart the moment things get busy. Scheduling it as a recurring calendar block, with a light log of what was covered, keeps it from being the first thing dropped during a deadline crunch.</p>
      <h2>Rotate mentors periodically</h2>
      <p>Pairing the same two people indefinitely narrows the range of what gets taught. Rotating mentors every few months exposes each team member to different approaches and prevents any one person's blind spots from becoming the team's blind spots.</p>
    `,
    publishedAt: "2026-05-15T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["ict-training"],
    tags: [TAGS.training, TAGS.mentorship, TAGS.sme],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=823&fit=crop&q=80",
      alt: "Senior and junior colleague reviewing code together on a shared monitor",
    },
  },
  {
    slug: "blockchain-use-cases-beyond-cryptocurrency",
    title: "Blockchain Use Cases Beyond Cryptocurrency Speculation",
    excerpt:
      "For most business owners, 'blockchain' still means crypto trading. The more interesting applications are quieter, less speculative, and already in use.",
    content: `
      <p>It's easy to understand why blockchain and cryptocurrency speculation have become synonymous in the public mind — the price charts get the attention. But some of the more durable applications of the underlying technology have nothing to do with trading tokens.</p>
      <h2>Supply chain verification</h2>
      <p>Recording a product's origin and movement on an immutable ledger gives buyers a way to verify authenticity that a printed certificate can't — particularly relevant for agricultural exports and handmade goods where provenance affects price.</p>
      <h2>Cross-border payments without the delay</h2>
      <p>For businesses paying suppliers or contractors across borders, stablecoin-based settlement can cut multi-day bank transfer times down to minutes, at meaningfully lower fees than traditional wire transfers.</p>
      <h2>Smart contracts as unglamorous automation</h2>
      <p>Stripped of the hype, a smart contract is just an agreement that executes itself once agreed conditions are met — useful for anything from escrow to royalty splits, without needing to trust a single intermediary to enforce the terms.</p>
      <blockquote>The technology is most useful exactly where nobody's watching the price chart.</blockquote>
    `,
    publishedAt: "2026-07-10T09:00:00.000Z",
    readTime: 7,
    category: catBySlug["web3"],
    tags: [TAGS.web3, TAGS.blockchain, TAGS.strategy],
    author: AUTHORS.patrick,
    coverImage: {
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=823&fit=crop&q=80",
      alt: "Abstract visualization of a distributed blockchain network with connected nodes",
    },
  },
  {
    slug: "remote-work-culture-without-micromanagement",
    title: "Building Remote Work Culture Without Micromanagement",
    excerpt:
      "The instinct to monitor every hour of a remote team's day usually backfires. Here's what actually builds trust and accountability instead.",
    content: `
      <p>The shift to remote and hybrid work exposed a management habit that never worked especially well in person either: substituting visible activity for actual output as a measure of whether someone is doing their job.</p>
      <h2>Define outcomes, not hours</h2>
      <p>A team member who delivers reliably in five focused hours shouldn't be penalized for not being visibly "online" for eight. Shifting performance conversations toward deliverables and deadlines, rather than activity trackers, changes the whole tone of remote management.</p>
      <h2>Overcommunicate context, not status</h2>
      <p>Remote teams don't fail from a lack of check-ins — they fail from a lack of shared context. Written updates on what changed and why tend to matter far more than a daily standup that just confirms everyone logged in.</p>
      <h2>Protect informal connection deliberately</h2>
      <p>In an office, relationships form by accident, in hallways and over lunch. Remote teams need to recreate some of that deliberately — a standing informal call, a non-work channel — or culture quietly erodes without anyone deciding it should.</p>
    `,
    publishedAt: "2026-06-20T09:00:00.000Z",
    readTime: 6,
    category: catBySlug["others"],
    tags: [TAGS.remote, TAGS.culture, TAGS.strategy],
    author: AUTHORS.dth,
    coverImage: {
      url: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1920&h=823&fit=crop&q=80",
      alt: "Remote worker on a video call with teammates visible on a laptop screen at a home desk",
    },
  },
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getRelatedPosts(
  currentSlug: string,
  categorySlug: string,
  limit = 3
): Post[] {
  return POSTS.filter(
    (p) => p.slug !== currentSlug && p.category.slug === categorySlug
  )
    .slice(0, limit)
    .concat(
      POSTS.filter(
        (p) => p.slug !== currentSlug && p.category.slug !== categorySlug
      )
    )
    .slice(0, limit);
}