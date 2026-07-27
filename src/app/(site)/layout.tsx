import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import NewsletterPopupGate from "@/components/NewsletterPopupGate";

const GA_ID = "G-NCE7K80751"; // ← keep in sync with root layout's GA_ID, or move to env var

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* GA4 only loads once CookieBanner records consent — see components/Analytics.tsx */}
      <Analytics gaId={GA_ID} />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CookieBanner />
      <NewsletterPopupGate />
    </ThemeProvider>
  );
}