'use client';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Figtree, sans-serif'
});

interface MermaidRendererProps {
  chart: string;
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.innerHTML = chart;
      mermaid.contentLoaded();
      
      // We need to re-render when chart changes
      const render = async () => {
        try {
          // Sanitize: Replace literal \n with actual newlines if present
          const sanitizedChart = chart.replace(/\\n/g, '\n');
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, sanitizedChart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
        }
      };
      render();
    }
  }, [chart]);

  return <div key={chart} ref={ref} className="mermaid-container" />;
}
