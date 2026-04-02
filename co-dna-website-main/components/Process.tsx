import './Process.css';

export default function Process() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Code Input',
      desc: 'Paste your code into the playground or capture it directly from your browser with the extension.',
    },
    {
      step: 'Step 2',
      title: 'Smart Analysis',
      desc: 'Code DNA understands your code structure, logic, and complexity to generate meaningful insights instantly.',
    },
    {
      step: 'Step 3',
      title: 'AI Transformation',
      desc: 'Convert your code across languages, generate flowcharts, and extract key logic with powerful AI processing.',
    },
    {
      step: 'Step 4',
      title: 'Insights & Optimization',
      desc: 'Get actionable suggestions, time estimates, and improvements to build faster and smarter.',
    },
  ];

  return (
    <section className="process-section">
      <div className="container">
        <div className="process-header">
          <span className="pill" style={{ marginBottom: '1rem', background: '#ffffff', color: '#000000' }}>Our Process</span>
          <h2>We analyze, transform, and visualize your code — so you can build smarter and faster.</h2>
        </div>
        
        <div className="process-grid">
          {steps.map((item, index) => (
            <div key={index} className="process-card">
              <div className="process-step">{item.step}</div>
              <h3 className="process-title">{item.title}</h3>
              <p className="process-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
