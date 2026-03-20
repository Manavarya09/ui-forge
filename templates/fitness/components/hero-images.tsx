"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const images = [
  {
    src: "/images/grid-strength.jpg",
    alt: "Chalk-covered hands gripping a heavy barbell with intense focus",
    label: "STRENGTH",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/grid-endurance.jpg",
    alt: "Athlete performing rope climbs in an industrial CrossFit gym",
    label: "ENDURANCE",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/grid-grit.jpg",
    alt: "CrossFit athlete resting between sets in a raw warehouse gym",
    label: "GRIT",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/grid-power.jpg",
    alt: "Explosive box jump captured mid-air with dramatic lighting",
    label: "POWER",
    aspect: "aspect-[4/5]",
  },
]

export function HeroImages() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-accent transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: isVisible ? "100%" : "0%" }}
      />

      {/* Section label */}
      <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-16 pb-3 md:pb-8 max-w-[1400px] mx-auto w-full">
        <div
          className="flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-30px)",
          }}
        >
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-5 md:w-8 h-[2px] bg-accent" />
            <span className="font-mono text-[8px] md:text-[10px] text-accent tracking-[0.2em] md:tracking-[0.4em] uppercase">
              The Work Speaks
            </span>
          </div>
          <span className="font-mono text-[7px] md:text-[10px] text-muted-foreground tracking-[0.15em] hidden md:block">
            004 FRAMES
          </span>
        </div>
      </div>

      {/* Image Grid */}
      <div className="px-4 md:px-8 lg:px-12 pb-6 md:pb-20 max-w-[1400px] mx-auto w-full">
        {/* Desktop: 4-column staggered */}
        <div className="hidden md:grid grid-cols-4 gap-3">
          {images.map((img, i) => {
            const offsets = [0, 48, 16, 64]
            return (
              <div
                key={img.label}
                className="relative group"
                style={{ marginTop: `${offsets[i]}px` }}
              >
                <div
                  className="transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0) skewY(0deg)"
                      : "translateY(60px) skewY(2deg)",
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  <div className={`relative overflow-hidden ${img.aspect}`}>
                    <Image
                      src={img.src || "/placeholder.svg"}
                      alt={img.alt}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/30 group-hover:bg-background/0 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" />
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-accent/0 group-hover:border-accent transition-colors duration-300" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-accent/0 group-hover:border-accent transition-colors duration-300" />
                    <span className="absolute top-3 right-3 font-mono text-[10px] text-foreground/30 group-hover:text-accent transition-colors duration-300 tracking-widest">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-sans text-2xl lg:text-3xl text-foreground/70 group-hover:text-foreground transition-colors duration-300 tracking-tight">
                      {img.label}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-4 h-[1px] bg-accent" />
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-accent" aria-hidden="true">
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: 2-column tight, equal height, no stagger offset */}
        <div className="grid grid-cols-2 gap-1.5 md:hidden">
          {images.map((img, i) => (
            <div
              key={img.label}
              className="relative"
            >
              <div
                className="transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    fill
                    className="object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-background/15" />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                  <span className="absolute top-1.5 right-1.5 font-mono text-[7px] text-foreground/40 tracking-widest">
                    0{i + 1}
                  </span>
                </div>
                <span className="mt-1.5 block font-sans text-sm text-foreground/70 tracking-tight">
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="h-[1px] bg-border" />
    </section>
  )
}
