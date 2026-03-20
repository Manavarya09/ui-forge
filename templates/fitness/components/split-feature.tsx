"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: "5:00", label: "AM First Class", suffix: "" },
  { value: "12", label: "Classes / Day", suffix: "" },
  { value: "98", label: "Member Retention", suffix: "%" },
  { value: "0", label: "Machines", suffix: "" },
]

export function SplitFeature() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Manifesto */}
        <div className="relative bg-secondary flex flex-col justify-center px-4 md:px-12 lg:px-16 py-5 md:py-24">
          <div className="absolute top-0 right-0 w-16 md:w-20 h-full diagonal-stripes opacity-20 hidden md:block" aria-hidden="true" />

          <div className={visible ? "brutal-reveal" : "opacity-0"}>
            <span className="font-mono text-[8px] md:text-[10px] text-accent tracking-[0.2em] md:tracking-[0.3em] uppercase block mb-2 md:mb-8">
              [Manifesto]
            </span>
            {/* Single line on mobile */}
            <h2 className="font-sans text-[9vw] sm:text-4xl md:text-7xl lg:text-8xl tracking-tighter text-foreground leading-[0.85] uppercase whitespace-nowrap mb-2 md:mb-8">
              We Don{"'"}t Do <span className="text-accent">Easy</span>.
            </h2>
            <div className="w-8 md:w-16 h-[2px] bg-accent mb-2 md:mb-8" />
            <p className="font-mono text-[9px] md:text-sm text-muted-foreground leading-relaxed max-w-md">
              This is not a gym. It{"'"}s a proving ground. Every rep is a question: how much do you want it? Every workout is an answer. We strip away the noise, the vanity, the comfort. What remains is raw human potential.
            </p>
          </div>
        </div>

        {/* Right: Stats grid */}
        <div className="relative bg-card">
          <div className="grid grid-cols-2 h-full">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col justify-center items-center p-3 md:p-10 lg:p-12 border-border ${
                  i < 2 ? "border-b" : ""
                } ${i % 2 === 0 ? "border-r" : ""}`}
              >
                <div
                  className={visible ? "brutal-reveal" : "opacity-0"}
                  style={{ animationDelay: `${0.2 + i * 0.15}s` }}
                >
                  <span className="font-sans text-[10vw] md:text-6xl lg:text-8xl text-foreground leading-none">
                    {stat.value}
                    <span className="text-accent">{stat.suffix}</span>
                  </span>
                  <span className="font-mono text-[7px] md:text-[10px] text-muted-foreground block mt-1 md:mt-3 tracking-[0.08em] md:tracking-[0.2em] uppercase text-center">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 md:w-16 md:h-16 bg-accent" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
