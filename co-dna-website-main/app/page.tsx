import Navbar from '@/components/Navbar';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ position: 'relative' }}>
      <BackgroundAnimation />
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
