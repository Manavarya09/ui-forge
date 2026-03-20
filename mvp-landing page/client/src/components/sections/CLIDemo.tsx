/* =============================================================
   CLI Demo Section — Interactive terminal experience
   Design: Liquid Brutalism Dark Premium
   Shows CLI commands and output in a realistic terminal
   ============================================================= */
import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

const cliCommands = [
  { prompt: "$", command: "npx @manavarya0909/ui-forge-cli create saas my-app", output: null },
  { prompt: "$", command: "cd my-app && npm install", output: "✓ Dependencies installed" },
  { prompt: "$", command: "npm run dev", output: "▲ Ready on http://localhost:3000" },
  { prompt: "$", command: "# Add glass style: --style glass", output: "🎨 Glass morphism applied!" },
];

export default function CLIDemo() {
  const [copied, setCopied] = useState(false);

  const fullCommand = "npx @manavarya0909/ui-forge-cli create saas my-app --style glass && cd my-app && npm install && npm run dev";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="demo"
      style={{
        backgroundColor: "#000",
        paddingTop: "6rem",
        paddingBottom: "8rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-badge">Live Demo</span>
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
            From idea to UI in seconds
          </h2>
        </div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "rgba(10, 10, 15, 0.95)",
            borderRadius: "1rem",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Terminal Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#febc2e",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <Terminal size={12} color="rgba(255,255,255,0.5)" />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "monospace",
                  }}
                >
                  Terminal
                </span>
              </div>
            </div>
          </div>

          {/* Terminal Content */}
          <div
            style={{
              padding: "1.5rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              lineHeight: "1.8",
            }}
          >
            {/* Logo Header */}
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "0.75rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#a855f7", fontWeight: "bold" }}>✨</span>{" "}
              <span style={{ color: "#fff" }}>UIForge</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.5)" }}>v1.0</span>
            </div>

            {/* Commands */}
            {cliCommands.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.3 }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#6366f1" }}>{item.prompt}</span>
                  <span style={{ color: "#e2e8f0" }}>{item.command}</span>
                </div>
                {item.output && (
                  <div
                    style={{
                      color: "#22c55e",
                      marginLeft: "16px",
                      marginTop: "4px",
                    }}
                  >
                    {item.output}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Blinking cursor */}
            <div style={{ display: "flex", gap: "8px", marginTop: "0.5rem" }}>
              <span style={{ color: "#6366f1" }}>$</span>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "16px",
                  background: "#fff",
                  animation: "blink 1s infinite",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Copy Command Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: copied ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${copied ? "rgba(34, 197, 94, 0.5)" : "rgba(255, 255, 255, 0.1)"}`,
              color: copied ? "#22c55e" : "rgba(255,255,255,0.8)",
              fontSize: "0.85rem",
              fontFamily: "'Barlow', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Command"}
          </button>
        </motion.div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Fully working Next.js app. No setup required.
        </motion.p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
