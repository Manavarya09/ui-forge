/* =============================================================
   Template Showcase — Available templates grid
   Design: Liquid Brutalism Dark Premium
   Shows all available templates with descriptions
   ============================================================= */
import { motion } from "framer-motion";
import { ExternalLink, Zap, Layout, BarChart, ShoppingBag, Briefcase, Sparkles } from "lucide-react";

const templates = [
  {
    id: "saas",
    name: "SaaS",
    description: "Conversion-focused landing with pricing, testimonials, and hero sections",
    icon: Zap,
    color: "#6366f1",
    demo: "https://uiforge-demos.vercel.app/saas",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Creative showcase for designers and developers",
    icon: Layout,
    color: "#ec4899",
    demo: "https://uiforge-demos.vercel.app/portfolio",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Analytics dashboard with charts, tables, and metrics",
    icon: BarChart,
    color: "#22c55e",
    demo: "https://uiforge-demos.vercel.app/dashboard",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "Multi-vendor e-commerce with product grids and filters",
    icon: ShoppingBag,
    color: "#f59e0b",
    demo: "https://uiforge-demos.vercel.app/marketplace",
  },
  {
    id: "agency",
    name: "Agency",
    description: "Professional services with portfolio and testimonials",
    icon: Briefcase,
    color: "#8b5cf6",
    demo: "https://uiforge-demos.vercel.app/agency",
  },
  {
    id: "ai-product",
    name: "AI Product",
    description: "Showcase AI capabilities with demo and feature sections",
    icon: Sparkles,
    color: "#06b6d4",
    demo: "https://uiforge-demos.vercel.app/ai-product",
  },
];

export default function TemplateShowcase() {
  return (
    <section
      id="templates"
      style={{
        backgroundColor: "#000",
        paddingTop: "6rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-badge">Templates</span>
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              color: "#fff",
              lineHeight: "0.9",
              letterSpacing: "-2px",
              marginTop: "0",
              marginBottom: "1rem",
            }}
          >
            Pick your starting point
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Six production-ready templates. Each customizable, each beautiful.
          </p>
        </div>

        {/* Templates Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255, 255, 255, 0.04)";
                  el.style.borderColor = template.color + "40";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255, 255, 255, 0.02)";
                  el.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "0.75rem",
                      background: `${template.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${template.color}30`,
                    }}
                  >
                    <Icon size={18} color={template.color} strokeWidth={1.5} />
                  </div>
                  <a
                    href={template.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      background: "rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }}
                  >
                    <ExternalLink size={12} />
                    Demo
                  </a>
                </div>

                {/* Content */}
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: "1.25rem",
                    color: "#fff",
                    marginBottom: "0.5rem",
                    marginTop: "0",
                  }}
                >
                  {template.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: "1.5",
                    margin: "0",
                  }}
                >
                  {template.description}
                </p>

                {/* Command hint */}
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(0,0,0,0.3)",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  uiforge create {template.id}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3rem",
          }}
        >
          <a
            href="https://github.com/Manavarya09/ui-forge"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "9999px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#fff",
              textDecoration: "none",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            View All Templates
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
