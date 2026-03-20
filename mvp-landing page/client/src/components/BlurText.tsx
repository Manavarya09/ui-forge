/* =============================================================
   BlurText — Word-by-word blur-in animation
   Design: Liquid Brutalism Dark Premium
   Each word animates: blur(10px)→0, opacity 0→1, y:50→0
   Uses IntersectionObserver for scroll-triggered start
   ============================================================= */
import { useEffect, useRef, useState } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number; // ms per word
}

export default function BlurText({ text, className = "", delay = 100 }: BlurTextProps) {
  const words = text.split(" ");
  const containerRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            transition: `opacity 0.35s ease ${i * delay}ms, filter 0.35s ease ${i * delay}ms, transform 0.35s ease ${i * delay}ms`,
            opacity: visible ? 1 : 0,
            filter: visible ? "blur(0px)" : "blur(10px)",
            transform: visible ? "translateY(0px)" : "translateY(50px)",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
