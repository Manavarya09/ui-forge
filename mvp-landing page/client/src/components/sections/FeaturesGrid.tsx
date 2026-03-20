/* =============================================================
   Features Grid — Design Styles showcase
   Design: Liquid Brutalism Dark Premium
   12 design styles with preview cards
   ============================================================= */
import { Sparkles, Layers, Code, Palette } from "lucide-react";

const designStyles = [
  { name: "Glass", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.2)" },
  { name: "Minimal", color: "#6366f1", bg: "rgba(99, 102, 241, 0.2)" },
  { name: "Brutalism", color: "#ef4444", bg: "rgba(239, 68, 68, 0.2)" },
  { name: "Enterprise", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.2)" },
  { name: "Bento", color: "#f97316", bg: "rgba(249, 115, 22, 0.2)" },
  { name: "Neumorphism", color: "#a855f7", bg: "rgba(168, 85, 247, 0.2)" },
  { name: "Flat", color: "#22c55e", bg: "rgba(34, 197, 94, 0.2)" },
  { name: "Material", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.2)" },
  { name: "Dark Minimal", color: "#e5e5e5", bg: "rgba(255, 255, 255, 0.1)" },
  { name: "Tech Futurism", color: "#22d3ee", bg: "rgba(34, 211, 238, 0.2)" },
  { name: "Monochrome", color: "#71717a", bg: "rgba(113, 113, 122, 0.2)" },
  { name: "Swiss", color: "#fafafa", bg: "rgba(250, 250, 250, 0.1)" },
];

const features = [
  {
    icon: Sparkles,
    title: "12 Design Styles",
    description: "Glass, Brutalism, Minimal, Enterprise, Bento, Neumorphism, Flat, Material, Dark Minimal, Tech Futurism, Monochrome, Swiss",
  },
  {
    icon: Layers,
    title: "12 Production Templates",
    description: "SaaS, Portfolio, Dashboard, Marketplace, Agency, AI Product, Real Estate, E-Commerce, Fitness & more",
  },
  {
    icon: Code,
    title: "Production Code",
    description: "Clean TypeScript, Next.js 14 App Router, Tailwind CSS, Framer Motion. No bloat.",
  },
  {
    icon: Palette,
    title: "AI-Powered Copy",
    description: "Generate marketing copy with Ollama (local) or Groq (cloud) AI providers.",
  },
];

export default function FeaturesGrid() {
  return (
    <section
      style={{
        backgroundColor: "#000",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-badge">Why UIForge</span>
          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              color: "#fff",
              lineHeight: "0.9",
              letterSpacing: "-2px",
              marginTop: "0",
              marginBottom: "0",
            }}
          >
            Not a builder. A system.
          </h2>
        </div>

        {/* Design Styles Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "0.75rem",
            marginBottom: "4rem",
          }}
        >
          {designStyles.map(({ name, color, bg }) => (
            <div
              key={name}
              className="liquid-glass"
              style={{
                borderRadius: "0.75rem",
                padding: "1rem",
                textAlign: "center",
                background: bg,
                border: `1px solid ${color}30`,
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: color,
                  margin: "0 auto 0.5rem",
                  boxShadow: `0 0 20px ${color}50`,
                }}
              />
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Feature Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="liquid-glass"
              style={{
                borderRadius: "1rem",
                padding: "1.5rem",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Icon circle */}
              <div
                className="liquid-glass-strong"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <Icon size={16} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
              </div>

              <h3
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "1.125rem",
                  color: "#fff",
                  marginBottom: "0.5rem",
                  marginTop: "0",
                  lineHeight: "1.2",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
