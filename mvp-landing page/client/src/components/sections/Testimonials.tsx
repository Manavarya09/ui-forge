/* =============================================================
   Testimonials — "Don't take our word for it."
   Design: Liquid Brutalism Dark Premium
   3-column liquid-glass cards with quote, name, role
   ============================================================= */

const testimonials = [
  {
    quote:
      "A complete landing page in minutes. The code was cleaner than what I usually write.",
    name: "Frontend Engineer",
    role: "",
  },
  {
    quote:
      "This feels like having a senior UI engineer inside your CLI.",
    name: "Indie Hacker",
    role: "",
  },
  {
    quote:
      "I stopped using templates completely after UIForge.",
    name: "Startup Founder",
    role: "",
  },
];

export default function Testimonials() {
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
          <span className="section-badge">What They Say</span>
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
            Don't take our word for it.
          </h2>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {testimonials.map(({ quote, name, role }) => (
            <div
              key={name}
              className="liquid-glass"
              style={{
                borderRadius: "1rem",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "3rem",
                  color: "rgba(255,255,255,0.2)",
                  lineHeight: "1",
                  marginBottom: "-1rem",
                }}
              >
                "
              </div>
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: "1.7",
                  fontStyle: "italic",
                  margin: "0",
                  flex: 1,
                }}
              >
                {quote}
              </p>
              <div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: "#fff",
                  }}
                >
                  {name}
                </div>
                {role && (
                  <div
                    style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "2px",
                    }}
                  >
                    {role}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
