'use client';
import Link from 'next/link';
import { TwitterLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import './Footer.css';

export default function Footer() {
  return (
    <>
      {/* Bottom CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Let AI do the Work so you can Scale Faster</h2>
              <p style={{ fontSize: '1.25rem', marginBottom: '40px' }}>Book a Call Today and Start Automating</p>
              
              <Link href="https://cal.com" className="btn-primary btn-accent" style={{ fontSize: '1.125rem', padding: '16px 32px' }}>
                Download
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Actual Footer */}
      <footer className="container">
        <div className="site-footer">
          <div className="footer-top">
            <div>
              <div className="footer-logo">CODE-DNA</div>
              <p style={{ maxWidth: '300px' }}>CODE-DNA brings AI automation to your fingertips & streamline tasks.</p>
            </div>
            
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/about" className="footer-link">About</Link>
              <Link href="/blog" className="footer-link">Blog</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div>© 2024 CODE-DNA. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="#" className="footer-link"><TwitterLogo size={24} /></Link>
              <Link href="#" className="footer-link"><InstagramLogo size={24} /></Link>
              <Link href="#" className="footer-link"><LinkedinLogo size={24} /></Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
