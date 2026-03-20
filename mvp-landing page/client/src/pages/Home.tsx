/* =============================================================
   Home Page — Studio Agency Landing Page
   Design: Liquid Brutalism Dark Premium
   Assembles all sections in order
   ============================================================= */
import CTAFooter from "@/components/sections/CTAFooter";
import FeaturesChess from "@/components/sections/FeaturesChess";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Partners from "@/components/sections/Partners";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Fixed Navbar */}
      <Navbar />

      {/* Section 2: Hero */}
      <Hero />

      {/* Section 3: Partners */}
      <Partners />

      {/* Section 4: How It Works */}
      <HowItWorks />

      {/* Section 5: Features Chess */}
      <FeaturesChess />

      {/* Section 6: Features Grid */}
      <FeaturesGrid />

      {/* Section 7: Stats */}
      <Stats />

      {/* Section 8: Testimonials */}
      <Testimonials />

      {/* Section 9: CTA Footer */}
      <CTAFooter />
    </div>
  );
}
