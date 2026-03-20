"use client"

import { useInView } from "@/hooks/use-in-view"
import data from "@/data/portfolio.json"

export function SkillsSection() {
  const { ref, inView } = useInView({ threshold: 0.1 })

  return (
    <section id="skills" ref={ref} className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-sm uppercase tracking-wider text-primary mb-4 font-mono">{data.skills.sectionTitle}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">{data.skills.heading}</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.skills.categories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className={`bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${categoryIndex * 100}ms` }}
            >
              <h4 className="text-lg font-semibold text-foreground mb-4">{category.title}</h4>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-muted-foreground text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
