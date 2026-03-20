"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const programs = [
  {
    id: "01",
    title: "WOD",
    subtitle: "Workout of the Day",
    description: "High-intensity functional movements. Constantly varied. Universally scalable.",
    time: "05:30 / 07:00 / 17:30",
    level: "ALL LEVELS",
    spots: 16,
  },
  {
    id: "02",
    title: "STRENGTH",
    subtitle: "Barbell Club",
    description: "Dedicated programming for the snatch, clean & jerk, squat, and deadlift.",
    time: "06:00 / 16:00",
    level: "INTERMEDIATE+",
    spots: 12,
  },
  {
    id: "03",
    title: "ENGINE",
    subtitle: "Conditioning",
    description: "Aerobic capacity and anaerobic power. Row, bike, run, swim.",
    time: "06:30 / 18:00",
    level: "ALL LEVELS",
    spots: 20,
  },
  {
    id: "04",
    title: "COMPETE",
    subtitle: "Competition Track",
    description: "For athletes chasing podiums. Extra volume. Mental fortitude. By application only.",
    time: "08:00 / 15:00",
    level: "ADVANCED",
    spots: 8,
  },
]

export function ProgramGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="program"
      ref={sectionRef}
      className="relative px-4 md:px-8 lg:px-12 py-5 md:py-20 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-0 mb-3 md:mb-8">
          {/* Left: Title + description */}
          <div className="flex flex-col justify-between">
            <div>
              <span
                className={`font-mono text-[8px] md:text-[10px] text-accent tracking-[0.2em] md:tracking-[0.3em] uppercase block mb-1 md:mb-3 ${visible ? "anim-cut-in" : "opacity-0"}`}
                style={{ animationDelay: "0.1s" }}
              >
                [Programs]
              </span>
              <h2 className="font-sans tracking-tighter text-foreground leading-none uppercase overflow-hidden">
                <span className={`block text-[13vw] sm:text-[10vw] md:text-8xl lg:text-9xl whitespace-nowrap ${visible ? "anim-shutter-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
                  Train Hard<span className="text-accent">.</span>
                </span>
              </h2>
            </div>

            <div className={`mt-2 lg:mt-0 lg:pb-2 ${visible ? "anim-cut-in" : "opacity-0"}`} style={{ animationDelay: "0.6s" }}>
              <p className="font-mono text-[9px] md:text-xs text-foreground/50 max-w-[260px] md:max-w-xs leading-relaxed mb-2 md:mb-5">
                Four distinct tracks. One standard: intensity. Every program is coached, programmed, and capped for quality.
              </p>
              <div className="flex items-center gap-3 md:gap-6">
                {[
                  { v: "04", l: "Programs" },
                  { v: "11", l: "Daily Classes" },
                  { v: "56", l: "Total Spots" },
                ].map((s) => (
                  <div key={s.l} className="flex items-baseline gap-1">
                    <span className="font-sans text-base md:text-2xl text-accent leading-none">{s.v}</span>
                    <span className="font-mono text-[6px] md:text-[9px] text-foreground/35 tracking-[0.1em] uppercase">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className={`relative lg:pl-8 ${visible ? "anim-wipe-right" : "opacity-0"}`} style={{ animationDelay: "0.4s" }}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/program-header.jpg"
                alt="CrossFit gym floor with loaded barbells"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-0 left-0 w-3 h-3 md:w-6 md:h-6 border-t-2 border-l-2 border-accent" />
              <div className="absolute bottom-0 right-0 w-3 h-3 md:w-6 md:h-6 border-b-2 border-r-2 border-accent" />
              <div className="absolute bottom-2 left-2 bg-background/90 px-1.5 py-0.5 md:px-2 md:py-1">
                <span className="font-mono text-[6px] md:text-[9px] text-foreground/60 tracking-[0.12em] md:tracking-[0.2em] uppercase">
                  6 Days / Week
                </span>
              </div>
            </div>
            <div className={`h-[2px] bg-accent mt-1 md:mt-2 ${visible ? "line-expand" : "w-0"}`} style={{ animationDelay: "0.8s" }} />
          </div>
        </div>

        {/* Program rows */}
        <div className="border-t border-border">
          {programs.map((program, idx) => (
            <div
              key={program.id}
              className={`border-b border-border group cursor-pointer relative ${visible ? "anim-counter-pop" : "opacity-0"}`}
              style={{ animationDelay: `${0.7 + idx * 0.1}s` }}
              onMouseEnter={() => setHoveredId(program.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-accent transition-transform duration-300 origin-top ${hoveredId === program.id ? "scale-y-100" : "scale-y-0"}`} />

              <div className="flex items-center justify-between py-3 md:py-6 pl-0 md:pl-4">
                {/* Left: ID + Title */}
                <div className="flex items-baseline gap-2 md:gap-8 min-w-0">
                  <span className="font-mono text-[8px] md:text-xs text-foreground/30 tabular-nums">{program.id}</span>
                  <div>
                    <h3 className={`font-sans text-xl md:text-6xl lg:text-7xl tracking-tighter leading-none uppercase transition-colors duration-300 ${hoveredId === program.id ? "text-accent" : "text-foreground"}`}>
                      {program.title}
                    </h3>
                    <span className="font-mono text-[7px] md:text-[10px] text-foreground/50 tracking-[0.08em] md:tracking-[0.2em] uppercase block">
                      {program.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description - desktop only */}
                <p className={`font-mono text-xs max-w-xs leading-relaxed text-foreground/60 transition-all duration-300 hidden lg:block ${hoveredId === program.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}>
                  {program.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-2 md:gap-6 shrink-0">
                  <div className="hidden sm:block">
                    <span className="font-mono text-[6px] md:text-[10px] text-foreground/35 block tracking-[0.08em] md:tracking-[0.2em] uppercase mb-0.5">Time</span>
                    <span className="font-mono text-[8px] md:text-xs text-foreground/75">{program.time}</span>
                  </div>
                  <div className="w-[1px] h-4 md:h-8 bg-border hidden sm:block" />
                  <div>
                    <span className="font-mono text-[6px] md:text-[10px] text-foreground/35 block tracking-[0.08em] md:tracking-[0.2em] uppercase mb-0.5">Level</span>
                    <span className={`font-mono text-[8px] md:text-xs ${program.level === "ADVANCED" ? "text-accent" : "text-foreground/75"}`}>
                      {program.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
