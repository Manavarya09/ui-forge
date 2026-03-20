/* =============================================================
   Home Page — Studio Agency Landing Page
   Design: Liquid Brutalism Dark Premium
   Assembles all sections in order
   ============================================================= */
import CTAFooter from "@/components/sections/CTAFooter";
import CLIDemo from "@/components/sections/CLIDemo";
import FeaturesChess from "@/components/sections/FeaturesChess";
import FeaturesGrid from "@/components/sections/FeaturesGrid";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Partners from "@/components/sections/Partners";
import Stats from "@/components/sections/Stats";
import TemplateShowcase from "@/components/sections/TemplateShowcase";
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

      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: CLI Demo */}
      <CLIDemo />

      {/* Section 3: Template Showcase */}
      <TemplateShowcase />

      {/* Section 4: Partners */}
      <Partners />

      {/* Section 5: How It Works */}
      <HowItWorks />

      {/* Section 6: Features Chess */}
      <FeaturesChess />

      {/* Section 7: Features Grid */}
      <FeaturesGrid />

      {/* Section 8: Stats */}
      <Stats />

      {/* Section 9: Testimonials */}
      <Testimonials />

      {/* Section 10: CTA Footer */}
      <CTAFooter />
    </div>
  );
}
