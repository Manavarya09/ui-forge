/* =============================================================
   How It Works — "You dream it. We ship it."
   Design: Liquid Brutalism Dark Premium
   HLS video background, centered content, liquid-glass CTA
   ============================================================= */
import HLSVideo from "@/components/HLSVideo";
import { ArrowUpRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <section
      id="process"
      style={{
        position: "relative",
        minHeight: "700px",
        backgroundColor: "#000",
        overflow: "hidden",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      {/* HLS Video Background */}
      <HLSVideo
        src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        className=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Top fade */}
      <div className="video-fade-top" />
      {/* Bottom fade */}
      <div className="video-fade-bottom" />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          minHeight: "500px",
          justifyContent: "center",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <span className="section-badge">How It Works</span>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
            color: "#fff",
            lineHeight: "0.9",
            letterSpacing: "-2px",
            maxWidth: "700px",
            marginBottom: "1.5rem",
            marginTop: "0",
          }}
        >
          You describe it. UIForge builds it.
        </h2>

        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "480px",
            lineHeight: "1.7",
            marginBottom: "2.5rem",
          }}
        >
          Run a single command. UIForge generates a complete, production-ready UI system with design tokens, components, and motion built in.
        </p>

        <a
          href="https://www.npmjs.com/package/@manavarya0909/ui-forge-cli"
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-strong"
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
            transition: "background 0.2s ease",
          }}
        >
          Install Free
          <ArrowUpRight size={16} strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}
