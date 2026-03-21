/* =============================================================
   CTA Footer — "Your next website starts here."
   Design: Liquid Brutalism Dark Premium
   HLS video background, centered CTA, footer links
   ============================================================= */
import HLSVideo from "@/components/HLSVideo";
import { ArrowUpRight } from "lucide-react";

export default function CTAFooter() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        paddingTop: "8rem",
        paddingBottom: "0",
      }}
    >
      {/* HLS Video Background */}
      <HLSVideo
        src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
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

      {/* Top + bottom fades */}
      <div className="video-fade-top" />
      <div className="video-fade-bottom" />

      {/* CTA Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingBottom: "4rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            color: "#fff",
            lineHeight: "0.9",
            letterSpacing: "-3px",
            maxWidth: "700px",
            marginBottom: "1.5rem",
            marginTop: "0",
          }}
        >
          Your next UI starts here.
        </h2>

        <p
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "400px",
            lineHeight: "1.6",
            marginBottom: "2.5rem",
          }}
        >
          Run one command. Get a production-ready frontend or backend in seconds. Free forever.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {/* Primary — liquid-glass-strong */}
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
            }}
          >
            npx uiforge
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>

          {/* Secondary — solid white */}
          <a
            href="#pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "9999px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#000",
              background: "#fff",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#fff";
            }}
          >
            View Docs
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "8rem",
          paddingTop: "2rem",
          paddingBottom: "2rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          © 2026 UIForge
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
