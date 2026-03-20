/* =============================================================
   Features Chess — Alternating text/image rows
   Design: Liquid Brutalism Dark Premium
   Row 1: text left, image right
   Row 2: image left, text right (reversed)
   ============================================================= */
import { ArrowUpRight } from "lucide-react";

const FEATURE_1_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663458256866/eLTZEcQwhQjeNoZKaEfgc4/feature-convert-VvtDeymjNYuHqEk88qNNq4.webp";
const FEATURE_2_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663458256866/eLTZEcQwhQjeNoZKaEfgc4/feature-smart-6F5TKjYrjDJD5nZohqmnb2.webp";

export default function FeaturesChess() {
  return (
    <section
      id="services"
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
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span className="section-badge">Capabilities</span>
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
            Engineered for real production.
          </h2>
        </div>

        {/* Row 1: text left, image right */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4rem",
            marginBottom: "6rem",
            flexWrap: "wrap",
          }}
        >
          {/* Text */}
          <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
            <h3
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "#fff",
                lineHeight: "1",
                letterSpacing: "-1px",
                marginBottom: "1.25rem",
                marginTop: "0",
              }}
            >
              Engineered for real production.
            </h3>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: "1.7",
                marginBottom: "2rem",
              }}
            >
              Every component is structured, scalable, and developer-ready. Built with real architecture—not visual hacks.
            </p>
            <a
              href="#contact"
              className="liquid-glass-strong"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "9999px",
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                fontSize: "0.85rem",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Explore Features
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </div>

          {/* Image */}
          <div
            className="liquid-glass"
            style={{
              flex: "1 1 300px",
              minWidth: "280px",
              borderRadius: "1rem",
              overflow: "hidden",
              aspectRatio: "4/3",
            }}
          >
            <img
              src={FEATURE_1_IMG}
              alt="Conversion-optimized design"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        {/* Row 2: image left, text right */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4rem",
            flexWrap: "wrap-reverse",
          }}
        >
          {/* Image */}
          <div
            className="liquid-glass"
            style={{
              flex: "1 1 300px",
              minWidth: "280px",
              borderRadius: "1rem",
              overflow: "hidden",
              aspectRatio: "4/3",
            }}
          >
            <img
              src={FEATURE_2_IMG}
              alt="AI-powered optimization"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Text */}
          <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
            <h3
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "#fff",
                lineHeight: "1",
                letterSpacing: "-1px",
                marginBottom: "1.25rem",
                marginTop: "0",
              }}
            >
              Design systems. Automated.
            </h3>
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: "1.7",
                marginBottom: "2rem",
              }}
            >
              UIForge generates consistent design tokens, spacing systems, and reusable components—so your UI stays clean as it scales.
            </p>
            <a
              href="#contact"
              className="liquid-glass-strong"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "9999px",
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                fontSize: "0.85rem",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              See CLI in action
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
