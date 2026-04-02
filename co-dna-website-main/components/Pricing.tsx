'use client';
import { useState } from 'react';
import { CheckCircle } from '@phosphor-icons/react';
import './Pricing.css';

const plans = [
  {
    name: "BASIC (Free Plan)",
    price: "Free",
    period: "",
    desc: "12 credits/month (1 request = 1–3 credits)",
    features: [
      "Code explanation",
      "Basic code analysis",
      "Limited code conversion",
      "Technical debt score"
    ],
    cta: "Start for free",
    popular: false
  },
  {
    name: "ADVANCED",
    price: "₹1,999",
    period: "/month",
    desc: "500–1000 credits/month",
    features: [
      "Everything in Free +",
      "Full code conversion (multi-language)",
      "Code modernization",
      "Flowcharts (BIG differentiator)",
      "Faster AI model",
      "Priority processing",
      "API access (limited)"
    ],
    cta: "Upgrade to Advanced",
    popular: true
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "",
    desc: "(customizable) | Unlimited usage",
    features: [
      "Everything in Advanced +",
      "Full repo analysis",
      "GitHub integration",
      "Team dashboard",
      "Private deployment",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly'|'annually'>('monthly');

  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-header">
          <span className="pill" style={{ marginBottom: '1rem', background: '#9333ea20', color: '#d8b4fe', borderColor: '#9333ea50' }}>Pricing</span>
          <h2>Powerful AI for Your Code, at the Right Price</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>Choose a plan that helps you understand, improve, and scale your code faster.</p>
          
          <div className="billing-toggle">
            <button 
              className={`billing-btn ${billing === 'monthly' ? 'active' : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`billing-btn ${billing === 'annually' ? 'active' : ''}`}
              onClick={() => setBilling('annually')}
            >
              Annually
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Popular</div>}
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price" style={{ fontSize: plan.price === 'Custom' ? '2.5rem' : '3rem' }}>
                {plan.price}<span className="pricing-period">{plan.period}</span>
              </div>
              <p className="pricing-desc">{plan.desc}</p>
              
              <button className={plan.popular ? 'btn-primary btn-accent full-width-btn' : 'btn-primary full-width-btn'}>
                {plan.cta}
              </button>
              
              <div className="pricing-features">
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 500, marginBottom: '24px' }}>What's Included:</div>
                {plan.features.map((f, j) => (
                  <div key={j} className="feature-item">
                    <CheckCircle size={20} weight="fill" color={plan.popular ? '#9333ea' : '#71717a'} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
