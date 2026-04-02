'use client';
import { useRef, useState } from 'react';
import { HandSwipeRight } from '@phosphor-icons/react';
import './Testimonials.css';

const testimonials = [
  {
    quote: "Code DNA helped us instantly understand legacy code that used to take hours. The technical debt analysis alone saved our team weeks of refactoring time.",
    name: "Arjun Mehta",
    title: "CTO at DevScale Labs"
  },
  {
    quote: "The code conversion feature is insane. We migrated parts of our backend from JavaScript to Python in minutes instead of days.",
    name: "Rohit Sharma",
    title: "Full Stack Developer at StackForge"
  },
  {
    quote: "The technical debt score gave us clarity on what actually needed fixing. Instead of guessing, we now prioritize based on real impact.",
    name: "Neha Kapoor",
    title: "Software Engineer at CodeCraft"
  },
  {
    quote: "Flowcharts from code? That’s a game changer. It made onboarding new developers 10x faster in our team.",
    name: "Karan Verma",
    title: "Engineering Lead at BuildX"
  },
  {
    quote: "Code DNA feels like having a senior engineer reviewing your code 24/7. It catches issues, explains logic, and even modernizes outdated code.",
    name: "Aditya Singh",
    title: "Backend Developer at Nexa Systems"
  },
  {
    quote: "We used Code DNA to analyze our entire module before release. It reduced bugs significantly and improved our deployment confidence.",
    name: "Priya Nair",
    title: "Product Engineer at LaunchPad Tech"
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => {
    setIsDown(false);
  };

  const onMouseUp = () => {
    setIsDown(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    if (containerRef.current) {
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="pill" style={{ marginBottom: '1rem', background: '#9333ea20', color: '#d8b4fe', borderColor: '#9333ea50' }}>Testimonials</span>
          <h2>Why Developers Love Code DNA</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>Real code, real insights, real improvements powered by AI.</p>
        </div>
      </div>
      
      <div 
        className="testimonials-track-container" 
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="testimonials-track">
          {/* Double the array for longer track to ensure drag works nicely */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{
                   backgroundImage: `url('https://ui-avatars.com/api/?name=${t.name.split(' ').join('+')}&background=random')`,
                   backgroundSize: 'cover'
                }} />
                <div className="author-info">
                  <h4>{t.name}</h4>
                  <p>{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="drag-label">
        <HandSwipeRight size={20} />
        DRAG TO EXPLORE
      </div>
    </section>
  );
}
