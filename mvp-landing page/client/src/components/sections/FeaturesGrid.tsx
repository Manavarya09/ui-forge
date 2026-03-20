/* =============================================================
   Features Grid — 4-column "Why Us" cards
   Design: Liquid Brutalism Dark Premium
   4 liquid-glass cards with icon, title, description
   ============================================================= */
import { BarChart3, Palette, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Generate full UI systems in seconds, not weeks.",
  },
  {
    icon: Palette,
    title: "Design System First",
    description: "Typography, spacing, and tokens—automatically structured.",
  },
  {
    icon: BarChart3,
    title: "Production Code",
    description: "Clean, scalable React code. No templates. No bloat.",
  },
  {
    icon: Shield,
    title: "Developer Native",
    description: "Works directly in your stack. No lock-in.",
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

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
