/* =============================================================
   How It Works — 3 steps to production
   Design: Liquid Brutalism Dark Premium
   ============================================================= */
import { motion } from "framer-motion";
import { Terminal, Palette, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Terminal,
    title: "Run one command",
    description: "npx uiforge — that's it. Choose frontend or backend, pick a template, select a design language.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Customize freely",
    description: "Every design token, component, and style is yours. Edit everything. No vendor lock-in.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Ship to production",
    description: "Generated code passes linting, type checking, and is ready for Vercel, Netlify, or any host.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="process"
      style={{
        backgroundColor: "#000",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span className="section-badge">How It Works</span>
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
            Three steps. Done.
          </h2>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            From idea to production in minutes. Not hours. Not days.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {steps.map(({ number, icon: Icon, title, description }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="liquid-glass"
              style={{
                borderRadius: "1.5rem",
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  position: "absolute",
                  top: "-1rem",
                  right: "-0.5rem",
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "6rem",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                {number}
              </div>

              {/* Icon */}
              <div
                className="liquid-glass-strong"
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <Icon size={20} color="#fff" strokeWidth={1.5} />
              </div>

              <h3
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  color: "#fff",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                }}
              >
                {title}
              </h3>

              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "1.7",
                  margin: 0,
                }}
              >
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
