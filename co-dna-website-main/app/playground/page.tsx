import Navbar from '@/components/Navbar';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import Footer from '@/components/Footer';
import Playground from '@/components/Playground';

export default function PlaygroundPage() {
  return (
    <main style={{ position: 'relative', overflowX: 'hidden' }}>
      <BackgroundAnimation />
      <Navbar />
      <Playground />
      <Footer />
    </main>
  );
}
