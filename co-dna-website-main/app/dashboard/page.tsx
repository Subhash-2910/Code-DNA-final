import Navbar from '@/components/Navbar';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      <BackgroundAnimation />
      <Navbar />
      <Dashboard user={user} />
      <Footer />
    </main>
  );
}
