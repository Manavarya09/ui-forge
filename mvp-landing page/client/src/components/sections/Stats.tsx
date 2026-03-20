/* =============================================================
   Stats Section — 4 key metrics
   Design: Liquid Brutalism Dark Premium
   HLS video background (desaturated), liquid-glass-strong card
   4-column grid on large screens, 2-column on mobile
   ============================================================= */
import HLSVideo from "@/components/HLSVideo";

const stats = [
  { value: "200+", label: "Projects Generated" },
  { value: "98%", label: "Dev Satisfaction" },
  { value: "3.2x", label: "Faster Builds" },
  { value: "5 days", label: "Setup Time" },
];

export default function Stats() {
  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      {/* HLS Video Background */}
      <HLSVideo
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: "saturate(0)",
        }}
      />

      {/* Top + bottom fades */}
      <div className="video-fade-top" />
      <div className="video-fade-bottom" />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          className="liquid-glass-strong"
          style={{
            borderRadius: "1.5rem",
            padding: "clamp(2rem, 5vw, 4rem)',",
            paddingTop: "3rem",
            paddingBottom: "3rem",
            paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
            paddingRight: "clamp(1.5rem, 4vw, 4rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2rem",
              textAlign: "center",
            }}
            className="stats-grid"
          >
            {stats.map(({ value, label }) => (
              <div key={label} style={{ padding: "1rem 0" }}>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
                    color: "#fff",
                    lineHeight: "1",
                    letterSpacing: "-2px",
                    marginBottom: "0.5rem",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
