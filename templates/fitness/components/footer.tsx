"use client"

import { useEffect, useRef, useState } from "react"

export function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (marqueeRef.current) observer.observe(marqueeRef.current)
    return () => observer.disconnect()
  }, [])

  const marqueeText = "IRON DISTRICT / CROSSFIT / "

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Marquee */}
      <div ref={marqueeRef} className="overflow-hidden border-b border-border py-3 md:py-8">
        <div className={`flex whitespace-nowrap transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex animate-marquee-footer shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={`a-${i}`} className="font-sans text-[10vw] md:text-[7vw] tracking-tighter uppercase footer-stroke-text">
                {marqueeText}
              </span>
            ))}
          </div>
          <div className="flex animate-marquee-footer shrink-0" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={`b-${i}`} className="font-sans text-[10vw] md:text-[7vw] tracking-tighter uppercase footer-stroke-text">
                {marqueeText}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 md:mb-6">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-accent" />
              <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] text-foreground uppercase">
                Iron District
              </span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
              Raw. Relentless. Results.
              <br />
              No shortcuts. No excuses.
              <br />
              Just iron.
            </p>
          </div>

          {/* Links */}
          <div>
            <span className="font-mono text-[9px] md:text-[10px] text-accent tracking-[0.25em] md:tracking-[0.3em] uppercase block mb-2.5 md:mb-4">
              Navigate
            </span>
            <nav className="flex flex-col gap-2 md:gap-3">
              {["Programs", "Schedule", "Athletes", "Pricing", "FAQ"].map((link) => (
                <a key={link} href="#" className="font-mono text-[10px] md:text-xs text-muted-foreground hover:text-accent transition-colors tracking-[0.08em] md:tracking-[0.1em] py-0.5 min-h-[32px] flex items-center">
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <span className="font-mono text-[9px] md:text-[10px] text-accent tracking-[0.25em] md:tracking-[0.3em] uppercase block mb-2.5 md:mb-4">
              Contact
            </span>
            <div className="flex flex-col gap-1.5 md:gap-3 font-mono text-[10px] md:text-xs text-muted-foreground">
              <span>412 Industrial Blvd</span>
              <span>Unit 7, Dock C</span>
              <span>Portland, OR 97201</span>
              <a href="mailto:info@irondistrict.com" className="hover:text-accent transition-colors mt-1 break-all">
                info@irondistrict.com
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <span className="font-mono text-[9px] md:text-[10px] text-accent tracking-[0.25em] md:tracking-[0.3em] uppercase block mb-2.5 md:mb-4">
              Hours
            </span>
            <div className="flex flex-col gap-1.5 md:gap-3 font-mono text-[10px] md:text-xs text-muted-foreground">
              <div className="flex justify-between gap-4 max-w-[180px]">
                <span>MON-FRI</span>
                <span>05:30 - 20:30</span>
              </div>
              <div className="flex justify-between gap-4 max-w-[180px]">
                <span>SAT</span>
                <span>08:00 - 13:00</span>
              </div>
              <div className="flex justify-between gap-4 max-w-[180px]">
                <span>SUN</span>
                <span className="text-accent">CLOSED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-5 md:mt-16 pt-4 md:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4">
          <span className="font-mono text-[8px] md:text-[10px] text-muted-foreground">
            &copy; 2026 IRON DISTRICT. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-4 md:gap-6">
            {["Instagram", "YouTube", "Twitter"].map((social) => (
              <a key={social} href="#" className="font-mono text-[8px] md:text-[10px] text-muted-foreground hover:text-accent transition-colors tracking-[0.1em] md:tracking-[0.15em] uppercase py-1 min-h-[32px] flex items-center">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-5 h-5 md:w-8 md:h-8 bg-accent" aria-hidden="true" />
    </footer>
  )
}
