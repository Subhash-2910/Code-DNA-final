'use client';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="section hero-section">
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-pill">
          <span className="hero-pill-badge">New</span>
          AI Powered Code Analysis
        </div>
        
        <h1 className="hero-title">
          Intelligent Code Analysis.<br />Built In.
        </h1>
        
        <p className="hero-subtitle">
          Code DNA analyzes, transforms, and visualizes your code — helping you switch languages, understand logic, and estimate development time instantly
        </p>
        
        <div className="hero-actions" style={{ marginBottom: '1.5rem' }}>
          <Link href="/contact" className="btn-primary" style={{ background: '#9333ea', color: '#fff' }}>
            Download extension
            <ArrowUpRight size={16} weight="bold" style={{ marginLeft: 8 }} />
          </Link>
          <Link href="#services" className="btn-outline">
            How it works
          </Link>
        </div>
        
        <div>
          <Link href="/playground" className="glass-button">
            Try out playground
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
