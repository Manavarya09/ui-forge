/* =============================================================
   Hero Section — 1000px height, video background, blur-text
   Design: Liquid Brutalism Dark Premium
   - Background video (mp4, absolute positioned)
   - BlurText heading animation
   - Framer Motion subtext + CTA
   - Bottom black gradient fade
   ============================================================= */
import BlurText from "@/components/BlurText";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        height: "1000px",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Background video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: "20%",
          left: 0,
          width: "100%",
          height: "auto",
          objectFit: "contain",
          zIndex: 0,
        }}
      />

      {/* Light darkening overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.05)",
          zIndex: 0,
        }}
      />

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "300px",
          background: "linear-gradient(to bottom, transparent, black)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "150px",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="liquid-glass"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "9999px",
            padding: "4px 4px 4px 4px",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              background: "#fff",
              color: "#000",
              borderRadius: "9999px",
              padding: "2px 10px",
              fontSize: "0.7rem",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Open Source
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.8rem",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              paddingRight: "10px",
            }}
          >
            Introducing UIForge CLI
          </span>
        </motion.div>

        {/* Heading with BlurText */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            color: "#fff",
            lineHeight: "0.9",
            letterSpacing: "-4px",
            maxWidth: "900px",
            marginBottom: "1.5rem",
            marginTop: 0,
          }}
        >
          <BlurText text="Build Production UI in Seconds" delay={100} />
        </h1>

        {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px",
              lineHeight: "1.6",
              marginBottom: "2.5rem",
            }}
          >
            Generate premium, animation-rich frontend systems with one command. No templates. No drag-and-drop. Just real code.
          </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
        >
          {/* Primary CTA — liquid-glass-strong */}
          <a
            href="#contact"
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
            Install CLI
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>

          {/* Secondary CTA — text only */}
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "9999px",
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.7)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
            }}
          >
            <Play size={14} fill="currentColor" strokeWidth={0} />
            View Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
