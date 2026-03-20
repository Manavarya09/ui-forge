"use client"

import { useInView } from "@/hooks/use-in-view"
import { Mail, Github, Linkedin, MapPin, Clock } from "lucide-react"
import data from "@/data/portfolio.json"

export function ContactSection() {
  const { ref, inView } = useInView({ threshold: 0.2 })

  return (
    <section id="contact" ref={ref} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-sm uppercase tracking-wider text-primary mb-4 font-mono">{data.contact.sectionTitle}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{data.contact.heading}</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">{data.contact.description}</p>
        </div>

        <div
          className={`grid md:grid-cols-2 gap-8 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${data.personal.email}`}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {data.personal.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Availability</p>
                <p className="text-foreground">{data.personal.availability}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-foreground">{data.personal.location}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-6 p-8 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground text-center">Find me on</p>
            <div className="flex gap-6">
              <a
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
              >
                <Github className="w-7 h-7" />
              </a>
              <a
                href={data.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
              >
                <Linkedin className="w-7 h-7" />
              </a>
              <a
                href={`mailto:${data.personal.email}`}
                className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
              >
                <Mail className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>

        <div
          className={`mt-16 pt-8 border-t border-border text-center transition-all duration-700 delay-400 ${inView ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-muted-foreground text-sm">{data.personal.copyright}</p>
        </div>
      </div>
    </section>
  )
}
