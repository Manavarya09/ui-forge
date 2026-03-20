/* =============================================================
   Template Showcase — Premium template gallery
   Design: Liquid Brutalism Dark Premium
   Showcases templates with visual previews
   ============================================================= */
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";

const templates = [
  {
    id: "saas",
    name: "SaaS",
    tagline: "Conversion-focused landing",
    description: "Perfect for software products with pricing tables, testimonials, and hero sections optimized for conversions.",
    gradient: "from-indigo-500 to-purple-600",
    accent: "#6366f1",
    preview: "https://picsum.photos/seed/saas/600/400",
  },
  {
    id: "saas-modern",
    name: "SaaS Modern",
    tagline: "Dashboard landing",
    description: "Modern SaaS with dashboard preview, bento grid, and social proof. Built for software products.",
    gradient: "from-blue-500 to-cyan-600",
    accent: "#0ea5e9",
    preview: "https://picsum.photos/seed/saasmod/600/400",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    tagline: "Creative showcase",
    description: "Ideal for designers, developers, and creatives looking to display their work with style.",
    gradient: "from-pink-500 to-rose-600",
    accent: "#ec4899",
    preview: "https://picsum.photos/seed/portfolio/600/400",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    tagline: "3D property showcase",
    description: "Stunning real estate portfolio with 3D house visualization. Perfect for property showcase.",
    gradient: "from-teal-500 to-emerald-600",
    accent: "#14b8a6",
    preview: "https://picsum.photos/seed/realestate/600/400",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    tagline: "Analytics interface",
    description: "Data-driven admin dashboard with charts, metrics cards, and clean data tables.",
    gradient: "from-emerald-500 to-teal-600",
    accent: "#22c55e",
    preview: "https://picsum.photos/seed/dashboard/600/400",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    tagline: "Shopping dashboard",
    description: "Full-featured e-commerce dashboard with cart management and product listings.",
    gradient: "from-amber-500 to-orange-600",
    accent: "#f59e0b",
    preview: "https://picsum.photos/seed/ecommerce/600/400",
  },
  {
    id: "fitness",
    name: "Fitness",
    tagline: "Gym landing page",
    description: "Bold fitness and gym landing page with programs, schedule, and membership options.",
    gradient: "from-red-500 to-orange-600",
    accent: "#ef4444",
    preview: "https://picsum.photos/seed/fitness/600/400",
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "Professional services",
    description: "Bold agency website with services showcase, portfolio grid, and client testimonials.",
    gradient: "from-violet-500 to-purple-600",
    accent: "#8b5cf6",
    preview: "https://picsum.photos/seed/agency/600/400",
  },
  {
    id: "tactical-dashboard",
    name: "Tactical",
    tagline: "Operations center",
    description: "Military-inspired tactical operations dashboard with command center and system monitoring.",
    gradient: "from-orange-500 to-red-600",
    accent: "#f97316",
    preview: "https://picsum.photos/seed/tactical/600/400",
  },
  {
    id: "ai-product",
    name: "AI Product",
    tagline: "Tech startup",
    description: "Modern AI product landing with capabilities showcase and integration features.",
    gradient: "from-cyan-500 to-blue-600",
    accent: "#06b6d4",
    preview: "https://picsum.photos/seed/ai/600/400",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    tagline: "Multi-vendor",
    description: "Multi-vendor marketplace with product grids, category filters, and shopping features.",
    gradient: "from-yellow-500 to-amber-600",
    accent: "#eab308",
    preview: "https://picsum.photos/seed/market/600/400",
  },
  {
    id: "premium-landing",
    name: "Premium",
    tagline: "Full-featured landing",
    description: "Complete landing page with premium animations, all sections, and stunning effects.",
    gradient: "from-purple-500 to-pink-600",
    accent: "#a855f7",
    preview: "https://picsum.photos/seed/premium/600/400",
  },
];

export default function TemplateShowcase() {
  return (
    <section
      id="templates"
      style={{
        backgroundColor: "#000",
        paddingTop: "8rem",
        paddingBottom: "10rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span className="section-badge">Templates</span>
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              color: "#fff",
              lineHeight: "1",
              letterSpacing: "-3px",
              marginTop: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            Start with production-ready templates
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "550px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Twelve handcrafted templates. Each designed with premium animations, responsive layouts, and clean code.
          </p>
        </div>

        {/* Templates Grid - Magazine Style */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "2rem",
          }}
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "1.5rem",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255, 255, 255, 0.04)";
                el.style.borderColor = `${template.accent}30`;
                el.style.transform = "translateY(-8px)";
                el.style.boxShadow = `0 25px 50px -12px ${template.accent}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255, 255, 255, 0.02)";
                el.style.borderColor = "rgba(255, 255, 255, 0.06)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Preview Image */}
              <div
                style={{
                  position: "relative",
                  height: "220px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                  }}
                />
                {/* Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                  }}
                />
                {/* Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    background: `${template.accent}20`,
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${template.accent}40`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#fff",
                      fontFamily: "'Barlow', sans-serif",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {template.tagline}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: "1.75rem",
                      color: "#fff",
                      margin: 0,
                      letterSpacing: "-1px",
                    }}
                  >
                    {template.name}
                  </h3>
                  <a
                    href={`https://uiforge-demos.vercel.app/${template.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: `${template.accent}15`,
                      border: `1px solid ${template.accent}30`,
                      color: template.accent,
                      transition: "all 0.2s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = template.accent;
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${template.accent}15`;
                      (e.currentTarget as HTMLElement).style.color = template.accent;
                    }}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: "1.6",
                    margin: "0 0 1.25rem 0",
                  }}
                >
                  {template.description}
                </p>

                {/* Command */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "0.75rem",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <code
                    style={{
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    uiforge create {template.id}
                  </code>
                  <ArrowRight size={14} color="rgba(255,255,255,0.3)" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Or start from scratch with any template
          </p>
          <a
            href="https://github.com/Manavarya09/ui-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-strong"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              borderRadius: "9999px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              fontSize: "0.95rem",
              color: "#fff",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            View All Templates
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
