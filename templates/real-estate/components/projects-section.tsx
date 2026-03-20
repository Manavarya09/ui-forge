"use client"

import { useInView } from "@/hooks/use-in-view"
import { ExternalLink, Github } from "lucide-react"
import data from "@/data/portfolio.json"

const projects = [
  {
    title: "UK Payroll RTI Integration",
    description:
      "Complete RTI application supporting FPS, EPS, NVR, and EYU. HMRC-compliant XML generation and submission with error handling and validation.",
    tags: ["ERPNext", "Python", "HMRC", "XML"],
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    title: "Real-Time POS Order System",
    description:
      "Node.js TCP server with MongoDB. React Native TCP client for live order updates. Kitchen and table status synchronization.",
    tags: ["Node.js", "React Native", "MongoDB", "TCP"],
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    title: "Smart Sales Manager",
    description:
      "Sales dashboard with analytics, customer and order management with secure login and role-based access.",
    tags: ["Flutter", "Firebase", "Analytics"],
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    title: "Delivery & Map-Based Apps",
    description: "Live order tracking using flutter_map & geolocator. Draggable sheets with markers and order lists.",
    tags: ["Flutter", "Maps", "Geolocation"],
    featured: false,
    github: "#",
    demo: "#",
  },
  {
    title: "ERPNext Customizations",
    description:
      "Advanced search and filtering logic, role-based permissions for ESS and sales users, custom list pages and navigation.",
    tags: ["ERPNext", "Frappe", "Python"],
    featured: false,
    github: "#",
    demo: "#",
  },
]

export function ProjectsSection() {
  const { ref, inView } = useInView({ threshold: 0.1 })

  return (
    <section id="projects" ref={ref} className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-sm uppercase tracking-wider text-primary mb-4 font-mono">{data.projects.sectionTitle}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">{data.projects.heading}</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.items.map((project, index) => (
            <div
              key={project.title}
              className={`group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 ${project.featured ? "lg:col-span-1" : ""} ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <a href={project.github} className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={project.demo} className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h4>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
