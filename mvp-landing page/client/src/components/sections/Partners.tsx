/* =============================================================
   Partners Bar — Trusted by the teams behind
   Design: Liquid Brutalism Dark Premium
   Centered column, badge + partner names in italic serif
   Subtle divider lines on each side of the partners row
   ============================================================= */

const partners = ["Next.js", "React", "Tailwind", "Vercel", "shadcn/ui"];

export default function Partners() {
  return (
    <section
      id="work"
      style={{
        backgroundColor: "#000",
        paddingTop: "3rem",
        paddingBottom: "5rem",
        textAlign: "center",
      }}
    >
      {/* Badge */}
      <div style={{ marginBottom: "2.5rem" }}>
        <span className="section-badge">Built for developers using</span>
      </div>

      {/* Partners row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(1.5rem, 4vw, 3rem)",
          flexWrap: "wrap",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {partners.map((name, i) => (
          <span
            key={name}
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 2.5vw, 1.75rem)",
              color: i === 2 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.4)",
              transition: "color 0.25s ease",
              cursor: "default",
              letterSpacing: "-0.5px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = i === 2 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.4)";
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
