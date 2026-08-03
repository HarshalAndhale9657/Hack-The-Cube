"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { X, Maximize2, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  alt: string;
  width: number;
  height: number;
}

const realGalleryImages: GalleryImage[] = [
  {
    id: "g1",
    url: "/images/gallery/IMG_5496.jpg",
    title: "Keynote & Inauguration",
    alt: "Hack the Cube Event Highlights & Keynote",
    width: 600,
    height: 400,
  },
  {
    id: "g2",
    url: "/images/gallery/8a71f028-ce2a-49b5-8294-36fec4e930ea.jpg",
    title: "24-Hour Non-Stop Hacking",
    alt: "Teams Hacking & Building Products",
    width: 600,
    height: 450,
  },
  {
    id: "g3",
    url: "/images/gallery/b4d0d1ee-c925-4d84-80cc-b24320f5a56d.jpg",
    title: "1-on-1 Expert Mentorship",
    alt: "Mentorship Round in Action",
    width: 600,
    height: 400,
  },
  {
    id: "g4",
    url: "/images/gallery/04d8ba46-0c07-485b-adbc-1773bb1be0b8.jpg",
    title: "Technical Talk Show",
    alt: "Technical Talk Show Session",
    width: 600,
    height: 400,
  },
  {
    id: "g5",
    url: "/images/gallery/4ba85611-2a63-45a5-9dd3-138b6f1e64d6.jpg",
    title: "Opening Ceremony Briefing",
    alt: "Opening Ceremony & Briefing",
    width: 600,
    height: 400,
  },
  {
    id: "g6",
    url: "/images/gallery/IMG_5504.jpg",
    title: "Prize Ceremony & Celebration",
    alt: "Winner Announcements & Award Ceremony",
    width: 600,
    height: 400,
  },
];

interface GalleryGridProps {
  images?: GalleryImage[];
}

export function GalleryGrid({ images = realGalleryImages }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // scrollDist = the pixel distance the rail must translate to show the last card
  // containerH = outer section height = scrollDist + viewport so sticky releases exactly when done
  const [scrollDist, setScrollDist] = useState(2000); // sensible default before measurement
  const [containerH, setContainerH] = useState("300vh"); // fallback before measurement

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const displayImages = images && images.length > 0 ? images : realGalleryImages;

  // Measure the exact pixel distance the rail needs to translate
  // containerHeight = that distance + one viewport height (so the sticky container
  // stays pinned for exactly the right scroll distance, then releases immediately)
  const measure = useCallback(() => {
    const rail = railRef.current;
    const viewport = viewportRef.current;
    if (!rail || !viewport || !rail.firstElementChild) return;

    const railW = rail.scrollWidth;
    // Push the last image to the left side (next to main text card) by translating
    // exactly the total width minus the width of one card.
    const cardW = rail.firstElementChild.clientWidth;
    const dist = Math.max(0, railW - cardW);
    const vh = window.innerHeight;

    setScrollDist(dist);
    // Section height = scroll distance we need + one viewport height
    // This guarantees: sticky pins for exactly `dist` pixels of scroll, then unpins
    setContainerH(`${dist + vh}px`);
  }, []);

  // useLayoutEffect runs synchronously after DOM paint but before browser
  // renders, so we measure before the user sees anything.
  // We also re-measure on resize.
  useLayoutEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      measure();
    };
    handleResize(); // set initial on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measure, displayImages]);

  // Track vertical scroll progress within the outer section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scrollYProgress 0→1 to translateX 0→-scrollDist (pixels)
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDist]);

  // Derive active card index from scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.floor(latest * displayImages.length),
      displayImages.length - 1
    );
    setActiveIndex(Math.max(0, idx));
  });

  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <>
      {/*
        Outer section: height = scrollDist + 100vh.
        The inner sticky div pins at top-0 and stays visible for exactly scrollDist
        pixels of scrolling, then unpins cleanly with zero blank space.
      */}
      <section
        id="gallery"
        ref={sectionRef}
        className="relative w-full bg-bg-void max-lg:!h-auto"
        style={{ height: isDesktop ? containerH : 'auto' }}
      >
        {/* Sticky viewport — pins to top on lg+, static on mobile */}
        <div className="lg:sticky top-0 lg:h-screen w-full flex items-center overflow-hidden py-12 lg:py-0">
          <div className="w-full grid lg:grid-cols-12 gap-8 items-center max-w-[1400px] mx-auto px-6 sm:px-10">

            {/* Left: heading + active photo info */}
            <div className="lg:col-span-5 space-y-6 z-20">
              <SectionHeading
                number="12"
                overline="Highlights"
                title="Last Year's Memories"
                subtitle="Relive moments, teamwork, and celebrations from previous CSI Student Chapter events"
                className="mb-4 text-left"
              />

              <div className="space-y-3 pt-2 border-t border-white/10">
                <span className="text-overline text-orange-500 font-mono tracking-widest block">
                  HIGHLIGHT 0{activeIndex + 1} / 0{displayImages.length}
                </span>
                <h3 className="text-heading-1 text-gray-050 font-display transition-all duration-300">
                  {activeImage.title}
                </h3>
                <p className="text-body text-gray-300 leading-relaxed font-normal transition-all duration-300">
                  {activeImage.alt}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setSelectedImage(activeImage)}
                  className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-orange-400 hover:text-orange-300 transition-colors group/btn cursor-pointer"
                >
                  <span>VIEW FULL RESOLUTION</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 pt-2">
                {displayImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? "w-8 bg-orange-500" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: horizontal photo rail */}
            <div ref={viewportRef} className="lg:col-span-7 overflow-x-auto lg:overflow-hidden py-4 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
              <motion.div
                ref={railRef}
                style={{ x: isDesktop ? x : undefined }}
                className="flex items-center gap-5 sm:gap-6 lg:gap-8 w-max will-change-transform"
              >
                {displayImages.map((image, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.div
                      key={image.id}
                      animate={{
                        scale: isActive ? 1.02 : 0.92,
                        opacity: isActive ? 1 : 0.55,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0 group/card relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 shadow-2xl transition-all duration-500 bg-navy-900"
                      style={{
                        width: "clamp(290px, 42vw, 520px)",
                        height: "clamp(340px, 52vh, 460px)",
                      }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                        sizes="(max-width: 768px) 80vw, 50vw"
                        priority={index <= 1}
                      />

                      {/* Vignette gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-void/90 via-transparent to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />

                      {/* Bottom card info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between z-10">
                        <div>
                          <span className="text-overline text-orange-400 font-mono block text-xs mb-1">
                            PHOTO 0{index + 1}
                          </span>
                          <h4 className="text-lg font-bold font-display text-gray-050">
                            {image.title}
                          </h4>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover/card:bg-orange-500 group-hover/card:border-orange-400 transition-colors">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-void/95 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-orange-500 transition-colors z-50 cursor-pointer"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden bg-navy-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full h-full min-h-[400px]"
                style={{
                  maxHeight: "85vh",
                  maxWidth: "100%",
                  margin: "0 auto",
                  aspectRatio: `${selectedImage.width} / ${selectedImage.height}`,
                }}
              >
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
