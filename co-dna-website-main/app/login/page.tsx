'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GithubLogo, GoogleLogo, EnvelopeSimple, LockSimple, ArrowRight, SealCheck } from '@phosphor-icons/react';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      window.location.href = '/playground';
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
    }
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow"></div>
      
      <div className="login-container fade-in">
        <div className="login-card glass">
          <div className="login-header">
            <Link href="/" className="login-logo">CODE-DNA</Link>
            <h1>Welcome Back</h1>
            <p>Intelligence for the next generation of developers.</p>
          </div>

          {message && (
            <div className={`auth-message ${message.type}`}>
              {message.type === 'success' ? <SealCheck size={18} /> : null}
              <span>{message.text}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleEmailLogin}>
            <div className="input-group">
              <label><EnvelopeSimple size={18} /> Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label><LockSimple size={18} /> Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="login-btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : <>Sign In <ArrowRight size={18} /></>}
            </button>
            
            <button type="button" className="login-btn-ghost" onClick={handleSignUp} disabled={loading}>
              Create New Account
            </button>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="oauth-group">
            <button className="oauth-btn" onClick={() => handleOAuthLogin('google')}>
              <GoogleLogo size={20} weight="bold" />
              <span>Google</span>
            </button>
            <button className="oauth-btn" onClick={() => handleOAuthLogin('github')}>
              <GithubLogo size={20} weight="fill" />
              <span>GitHub</span>
            </button>
          </div>
          
          <p className="login-footer">
            By continuing, you agree to our <Link href="/terms">Terms of Service</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
