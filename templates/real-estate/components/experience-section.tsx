"use client"

import { useInView } from "@/hooks/use-in-view"
import { Briefcase, GraduationCap } from "lucide-react"
import data from "@/data/portfolio.json"

export function ExperienceSection() {
  const { ref, inView } = useInView({ threshold: 0.1 })

  return (
    <section id="experience" ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-sm uppercase tracking-wider text-primary mb-4 font-mono">
            {data.experience.sectionTitle}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">{data.experience.heading}</h3>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-12">
            {data.experience.items.map((exp, index) => (
              <div
                key={index}
                className={`relative pl-0 md:pl-20 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-0 w-5 h-5 bg-primary rounded-full hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      {exp.type === "work" ? (
                        <Briefcase className="w-5 h-5 text-primary" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{exp.title}</h4>
                      <p className="text-primary">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
