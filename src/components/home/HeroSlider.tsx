"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types/database";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((v) => (v + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setActive((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[68vh] min-h-[420px] w-full overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3rem]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === active ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-parish-900/85 via-parish-900/30 to-parish-900/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
              <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400 backdrop-blur">
                Selamat Datang
              </p>
              <h1 className="max-w-2xl font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
                  {slide.subtitle}
                </p>
              )}
              {slide.link_url && (
                <Link
                  href={slide.link_url}
                  className="mt-7 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-parish-800 shadow-lg transition-transform hover:scale-[1.03]"
                >
                  Selengkapnya
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Slide sebelumnya"
            className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Slide berikutnya"
            className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:flex"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                aria-label={`Ke slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-8 bg-white" : "w-2.5 bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
