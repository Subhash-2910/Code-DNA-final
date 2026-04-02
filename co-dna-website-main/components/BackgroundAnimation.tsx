'use client';
import { useEffect, useRef } from 'react';
import './BackgroundAnimation.css';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.5; // Small stars
        this.speedY = (Math.random() - 0.5) * 0.2 - 0.1; // Slow upward drift
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.opacity = Math.random() * 0.5 + 0.1; // Random starting opacity
        this.fadeSpeed = (Math.random() - 0.5) * 0.01;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity += this.fadeSpeed;

        if (this.opacity <= 0.1 || this.opacity >= 0.8) {
          this.fadeSpeed = -this.fadeSpeed;
        }

        // Loop around edges seamlessly
        if (this.y < 0) this.y = canvas!.height;
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
      }

      draw() {
        ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); // Re-initialize particles on resize
    };

    // Initial size setup AFTER functions are defined
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="starfield-canvas" />
      <div className="bg-animation-container">
        {/* The Exact Framer Orb Center */}
        <div className="crystal-center">
          <div className="framer-orb-outer"></div>
          <div className="framer-orb-inner"></div>
        </div>
      </div>
    </>
  );
}
