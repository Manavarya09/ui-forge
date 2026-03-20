"use client"

import { useInView } from "@/hooks/use-in-view"
import data from "@/data/portfolio.json"

export function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.2 })

  const highlightText = (text: string) => {
    let result = text
    data.about.highlights.forEach((highlight) => {
      result = result.replace(highlight, `<span class="text-foreground font-medium">${highlight}</span>`)
    })
    return result
  }

  return (
    <section id="about" ref={ref} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <h2 className="text-sm uppercase tracking-wider text-primary mb-4 font-mono">{data.about.sectionTitle}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{data.about.heading}</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {data.about.paragraphs.map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: highlightText(paragraph) }} />
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl" />
              <div className="relative bg-card border border-border rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {data.about.stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4">
                      <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
