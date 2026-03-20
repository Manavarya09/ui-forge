/* =============================================================
   Navbar — Fixed floating pill navigation
   Design: Liquid Brutalism Dark Premium
   Fixed top-4, z-50, liquid-glass pill with nav links + CTA
   Scroll-aware: becomes slightly more opaque on scroll
   ============================================================= */
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Product", href: "#services" },
  { label: "Templates", href: "#work" },
  { label: "How it Works", href: "#process" },
  { label: "Docs", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: "1rem",
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        fontFamily: "'Barlow', sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          transition: "background 0.3s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "#fff",
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>

      {/* Center nav pill */}
      <div
        className="liquid-glass"
        style={{
          display: "none",
          alignItems: "center",
          gap: "2px",
          borderRadius: "9999px",
          padding: "6px 6px",
        }}
        id="nav-pill"
      >
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={(e) => handleNavClick(e, href)}
            style={{
              padding: "6px 16px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
              borderRadius: "9999px",
              transition: "all 0.2s ease",
              fontFamily: "'Barlow', sans-serif",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#fff";
              el.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "rgba(255,255,255,0.8)";
              el.style.background = "transparent";
            }}
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, "#contact")}
          style={{
            marginLeft: "6px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 16px",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#000",
            background: "#fff",
            textDecoration: "none",
            transition: "background 0.2s ease",
            fontFamily: "'Barlow', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.88)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff";
          }}
        >
          Install CLI
          <ArrowUpRight size={14} strokeWidth={2} />
        </a>
      </div>

      {/* Mobile CTA */}
      <a
        href="#contact"
        onClick={(e) => handleNavClick(e, "#contact")}
        className="mobile-cta"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 16px",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#000",
          background: "#fff",
          textDecoration: "none",
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        Install CLI
        <ArrowUpRight size={14} strokeWidth={2} />
      </a>

      <style>{`
        @media (min-width: 768px) {
          #nav-pill {
            display: flex !important;
          }
          .mobile-cta {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
