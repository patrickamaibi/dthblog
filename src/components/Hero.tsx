"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ROTATING_WORDS = ["Technology", "Digital Growth", "ICT Training", "Branding"];
const TYPING_SPEED = 90;
const DELETING_SPEED = 45;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 300;

function useTypingEffect(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (phase === "typing") {
      if (text.length < currentWord.length) {
        const t = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), TYPING_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), DELETING_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(t);
    }
  }, [text, phase, wordIndex, words]);

  return text;
}

/**
 * Hero carousel images — local brand photography served from /public.
 * Files must exist at:
 *   public/dth1.jpg
 *   public/dth2.jpg
 *   public/dth3.jpg
 * (dth1 and dth2 are reused a second time to fill all 5 carousel slots.)
 */
const HERO_IMAGES = [
  { src: "/dth1.jpg", alt: "DiscoveryTech Hub team collaborating" },
  { src: "/dth2.jpg", alt: "DiscoveryTech Hub workspace" },
  { src: "/dth3.jpg", alt: "DiscoveryTech Hub training session" },
  { src: "/dth2.jpg", alt: "DiscoveryTech Hub workspace" },
  { src: "/dth1.jpg", alt: "DiscoveryTech Hub team collaborating" },
];

const FLIP_INTERVAL_MS = 4200;
const HALF_FLIP_MS = 380;

/**
 * Cycles through a list of images with a 3D "flip" transition.
 * The card rotates to 90deg (edge-on, invisible), swaps the image instantly,
 * then rotates from -90deg back to 0deg, producing a continuous flip effect.
 */
function useFlipCarousel(length: number) {
  const [index, setIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const [instant, setInstant] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const framesRef = useRef<number[]>([]);

  useEffect(() => {
    const clearAll = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      framesRef.current.forEach(cancelAnimationFrame);
      framesRef.current = [];
    };

    const interval = setInterval(() => {
      setInstant(false);
      setAngle(90);

      const swapTimeout = setTimeout(() => {
        setInstant(true);
        setAngle(-90);
        setIndex((i) => (i + 1) % length);

        const frame1 = requestAnimationFrame(() => {
          const frame2 = requestAnimationFrame(() => {
            setInstant(false);
            setAngle(0);
          });
          framesRef.current.push(frame2);
        });
        framesRef.current.push(frame1);
      }, HALF_FLIP_MS);

      timeoutsRef.current.push(swapTimeout);
    }, FLIP_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearAll();
    };
  }, [length]);

  return { index, angle, instant };
}

export default function Hero() {
  const typed = useTypingEffect(ROTATING_WORDS);
  const { index, angle, instant } = useFlipCarousel(HERO_IMAGES.length);
  const currentImage = HERO_IMAGES[index];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-border overflow-hidden">
      {/* Blue blur gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#1A4FD6]/40 blur-[120px]" />
        <div className="absolute top-1/4 -right-24 h-[30rem] w-[30rem] rounded-full bg-[#0A1F44]/35 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[#1A4FD6]/20 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-5">
              <span className="text-accent">§</span> DiscoveryTech Hub Blog
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary dark:text-white leading-[1.05] mb-6">
              Insights on{" "}
              <span className="inline-block relative">
                <span className="bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-move bg-gradient-to-r from-primary via-accent to-primary dark:from-white dark:via-accent dark:to-white">
                  {typed}
                </span>
                <span className="inline-block w-[2px] h-[0.9em] bg-accent ml-1 align-middle animate-blink" />
              </span>
              <br className="hidden sm:block" />
              for African businesses.
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Ideas, guides, and field notes from the DiscoveryTech Hub team on
              web engineering, ICT training, and brand strategy.
            </p>
          </div>

          {/* Image column — 5-image flip carousel */}
          {/* Card renders at aspect-[4/3] — see dimension note in Hero.tsx if resizing source images */}
          <div className="relative aspect-[4/3] [perspective:1600px]">
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-border [transform-style:preserve-3d] will-change-transform"
              style={{
                transform: `rotateY(${angle}deg)`,
                transition: instant ? "none" : `transform ${HALF_FLIP_MS}ms ease-in-out`,
                backfaceVisibility: "hidden",
              }}
            >
              <Image
                key={currentImage.src}
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent dark:from-black/40" />
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {HERO_IMAGES.map((img, i) => (
                <span
                  key={img.src}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}