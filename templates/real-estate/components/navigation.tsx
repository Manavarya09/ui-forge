"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Github, Linkedin, Mail } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import data from "@/data/portfolio.json"

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = data.navigation.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent",
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
          {data.personal.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {data.navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "text-sm uppercase tracking-wider transition-colors hover:text-primary",
                  activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={data.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={data.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${data.personal.email}`}
            className="text-muted-foreground hover:text-primary transition-colors p-2"
          >
            <Mail className="w-5 h-5" />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
