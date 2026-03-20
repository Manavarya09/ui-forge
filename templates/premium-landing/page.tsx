import Navbar from './sections/navbar';
import Hero from './sections/hero';
import Features from './sections/features';
import Testimonials from './sections/testimonials';
import Pricing from './sections/pricing';
import Footer from './sections/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
