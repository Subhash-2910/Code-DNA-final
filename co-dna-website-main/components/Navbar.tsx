'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, SignOut, SignIn } from '@phosphor-icons/react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className={`nav-content ${scrolled ? 'glass' : ''}`}>
          <Link href="/" className="logo">
            CODE-DNA
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/playground" className="nav-link">Playground</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
          <div className="nav-actions">
            {user ? (
              <div className="user-profile-nav">
                <Link href="/dashboard" className="user-info hover:text-purple-400 transition-colors">
                  <User size={18} weight="bold" />
                  <span>{user.email?.split('@')[0]}</span>
                </Link>
                <button onClick={handleSignOut} className="btn-logout" title="Sign Out">
                  <SignOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SignIn size={18} weight="bold" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
