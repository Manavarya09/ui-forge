"use client"

import React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"

function Counter({
  target,
  suffix = "",
  go = false,
}: {
  target: number
  suffix?: string
  go?: boolean
}) {
  const [val, setVal] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (!go) return
    const dur = 900
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.floor(ease * target))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [go, target])

  return (
    <span>
      {val}
      {suffix}
    </span>
  )
}

function d(ms: number): React.CSSProperties {
  return { animationDelay: `${ms}ms` }
}

export function Hero() {
  const [go, setGo] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setGo(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  if (!go) return <section className="min-h-screen bg-background" />

  return (
    <section className="relative h-[100svh] flex flex-col overflow-hidden bg-background select-none">
      {/* ── Background image ── */}
      <div className="absolute inset-0 anim-cut-in" style={d(100)} aria-hidden="true">
        <Image
          src="/images/hero-main.jpg"
          alt="CrossFit athlete in an industrial gym"
          fill
          priority
          className="object-cover object-[65%_15%] sm:object-[70%_20%] md:object-center"
        />
        {/* Mobile: heavier bottom gradient so text pops, lighter top so image breathes */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent md:hidden" />
        <div className="absolute inset-0 bg-background/20 md:hidden" />
        {/* Desktop: side + bottom gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-background/20 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent hidden md:block" />
      </div>

      {/* Accent shard */}
      <div className="absolute top-[8%] md:top-[15%] left-0 w-[3px] h-[12vh] md:h-[40vh] bg-accent anim-grow-down z-10" style={d(400)} />

      {/* Grid lines desktop */}
      {[14, 28, 42].map((pos, i) => (
        <div
          key={pos}
          className="absolute top-0 h-full w-[1px] bg-foreground/[0.05] anim-grow-down hidden lg:block"
          style={{ left: `${pos}%`, ...d(250 + i * 100) }}
          aria-hidden="true"
        />
      ))}

      {/* ── NAV ── */}
      <nav className="relative z-20 flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 md:py-6 anim-cut-in" style={d(100)}>
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 md:w-8 md:h-8 flex items-center justify-center anim-snap-in" style={d(150)}>
            <div className="absolute inset-0 bg-accent" />
            <span className="relative font-sans text-sm md:text-lg text-accent-foreground leading-none">ID</span>
          </div>
          <div className="flex flex-col anim-slide-left" style={d(200)}>
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.4em] text-foreground uppercase leading-none">
              Iron District
            </span>
            <span className="font-mono text-[6px] md:text-[8px] tracking-[0.15em] text-foreground/40 uppercase">
              CrossFit Affiliate
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {["Program", "Schedule", "Athletes", "Contact"].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="group relative font-mono text-[11px] tracking-[0.25em] text-foreground/50 hover:text-foreground transition-colors uppercase anim-cut-in"
              style={d(200 + i * 60)}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <span className="font-mono text-[9px] text-foreground/30 hidden md:block tracking-[0.15em] anim-cut-in" style={d(300)}>
            EST. 2019
          </span>
          <a
            href="#contact"
            className="relative font-mono text-[8px] md:text-[11px] bg-accent text-accent-foreground px-3 md:px-5 py-2 md:py-2.5 tracking-[0.15em] uppercase overflow-hidden group anim-snap-in min-h-[36px] md:min-h-[40px] flex items-center"
            style={d(350)}
          >
            <span className="relative z-10">Join Now</span>
            <span className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 min-h-[36px] min-w-[36px] items-center justify-center anim-cut-in"
            style={d(350)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`w-5 h-[1.5px] bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-[1.5px] bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-3 right-4 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close menu"
        >
          <span className="w-5 h-[1.5px] bg-foreground block rotate-45 absolute" />
          <span className="w-5 h-[1.5px] bg-foreground block -rotate-45 absolute" />
        </button>
        {["Program", "Schedule", "Athletes", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            className="font-sans text-4xl tracking-tighter text-foreground uppercase hover:text-accent transition-colors min-h-[48px] flex items-center"
          >
            {item}
          </a>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-8 lg:px-12 md:justify-end md:pb-8">
        <div className="max-w-[1400px] mx-auto w-full text-center md:text-left">
          {/* Tagline */}
          <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 mb-2 md:mb-5 anim-wipe-right" style={d(300)}>
            <div className="h-[1.5px] w-5 md:w-16 bg-accent" />
            <span className="font-mono text-[7px] md:text-xs text-accent tracking-[0.15em] md:tracking-[0.4em] uppercase">
              No Mercy Fitness
            </span>
            <div className="h-[1.5px] w-5 bg-accent md:hidden" />
          </div>

          {/* Headline -- compact leading, tight vertical stack */}
          <div className="relative mb-2 md:mb-0">
            {["Break", "Every", "Limit."].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <h1
                  className={`font-sans leading-[0.85] tracking-[-0.04em] uppercase anim-shutter-up ${
                    word === "Every" ? "text-accent" : "text-foreground"
                  } text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[10vw]`}
                  style={d(400 + i * 120)}
                >
                  {word}
                </h1>
              </div>
            ))}
          </div>

          {/* Copy */}
          <p className="font-mono text-[8px] sm:text-[10px] md:text-[13px] text-foreground/60 max-w-[240px] sm:max-w-xs md:max-w-md mx-auto md:mx-0 leading-relaxed anim-cut-in" style={d(800)}>
            No mirrors. No machines. No mercy. Just barbells, chalk, and the will to be better than yesterday.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 mt-3 md:mt-6 anim-cut-in" style={d(900)}>
            <a
              href="#program"
              className="group relative font-mono text-[7px] sm:text-[9px] md:text-[11px] bg-foreground text-background px-3 sm:px-5 md:px-6 py-2 md:py-3 tracking-[0.12em] md:tracking-[0.2em] uppercase overflow-hidden min-h-[36px] md:min-h-[44px] flex items-center"
            >
              <span className="relative z-10 group-hover:text-accent-foreground transition-colors duration-300">View Programs</span>
              <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </a>
            <a
              href="#schedule"
              className="font-mono text-[7px] sm:text-[9px] md:text-[11px] text-foreground/60 px-3 sm:px-5 md:px-6 py-2 md:py-3 tracking-[0.12em] md:tracking-[0.2em] uppercase border border-foreground/20 hover:border-foreground hover:text-foreground transition-all min-h-[36px] md:min-h-[44px] flex items-center"
            >
              Schedule
            </a>
          </div>

          {/* Stats row -- tighter, proportional */}
          <div className="mt-4 md:mt-10 flex items-end justify-center md:justify-start gap-4 sm:gap-8 md:gap-12 anim-counter-pop" style={d(950)}>
            {[
              { target: 4, suffix: "", label: "Locations" },
              { target: 2000, suffix: "+", label: "Athletes" },
              { target: 98, suffix: "%", label: "Retention" },
            ].map((stat, i) => (
              <div key={stat.label} className="relative">
                <span className="font-sans text-[8vw] sm:text-[7vw] md:text-7xl lg:text-8xl text-foreground leading-none block">
                  <Counter target={stat.target} suffix={stat.suffix} go />
                </span>
                <span className="font-mono text-[5px] sm:text-[7px] md:text-[10px] text-foreground/40 block tracking-[0.12em] md:tracking-[0.25em] uppercase mt-0.5 md:mt-2">
                  {stat.label}
                </span>
                {i < 2 && (
                  <div className="absolute -right-2 sm:-right-4 md:-right-6 top-1/4 h-1/2 w-[1px] bg-foreground/15" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar desktop only */}
      <div className="relative z-10 px-4 md:px-8 lg:px-12 pb-4 md:pb-6 hidden md:block">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto w-full anim-cut-in" style={d(1000)}>
          <div className="flex items-center gap-3">
            <div className="w-[1px] h-10 bg-accent" />
            <span className="font-mono text-[9px] text-foreground/40 tracking-[0.3em] uppercase">Scroll</span>
          </div>
          <div className="flex items-center gap-6">
            {["05:30 AM", "MON-SAT", "OPEN GYM SUN"].map((info, i) => (
              <span key={info} className="font-mono text-[9px] text-foreground/40 tracking-[0.2em] uppercase">
                {i > 0 && <span className="text-accent mr-6">/</span>}
                {info}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-accent/40 anim-width-expand" style={d(600)} />
    </section>
  )
}
