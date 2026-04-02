'use client';
import { Robot, ListChecks, CalendarCheck, Paperclip, TrendUp, ChatCircleText, PenNib } from '@phosphor-icons/react';
import './Services.css';

export default function Services() {
  return (
    <section id="services" className="services-section">
      <div className="container">
        
        {/* Service 1 */}
        <div className="service-row">
          <div className="service-content">
            <h2 className="service-title">Smart Code Analysis</h2>
            <p className="service-desc">
              We break down your code structure instantly — helping you understand logic, detect patterns, and improve quality without manual effort.
            </p>
            <div className="service-tags">
              <span className="service-tag"><ListChecks size={20} /> Internal Task Bots</span>
              <span className="service-tag"><Robot size={20} /> 100+ Automations</span>
            </div>
          </div>
          
          <div className="service-visual glass">
            <div className="visual-content">
              <div style={{ padding: '0 0 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-white font-medium">All Tasks</span>
                <span className="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded">Waiting for approval</span>
              </div>
              <div className="task-item">
                <div>
                  <div className="task-title">Code Analysis</div>
                  <div className="task-date">Completed • Just now</div>
                </div>
                <div className="task-status">Completed</div>
              </div>
              <div className="task-item">
                <div>
                  <div className="task-title">Language Conversion (Python → JS)</div>
                </div>
                <div className="task-status px-2 py-1 rounded" style={{ background: '#9333ea20', color: '#d8b4fe' }}>Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2 */}
        <div className="service-row">
          <div className="service-content">
            <h2 className="service-title">Code Visualization</h2>
            <p className="service-desc">
              Turn complex code into clean flowcharts — making it easier to understand, debug, and explain.
            </p>
            <div className="service-tags">
              <span className="service-tag"><ChatCircleText size={20} /> Summaries</span>
              <span className="service-tag"><CalendarCheck size={20} /> Scheduling</span>
            </div>
          </div>
          
          <div className="service-visual glass" style={{ justifyContent: 'flex-end', paddingBottom: '32px' }}>
            <div className="visual-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>What can I help you with?</div>
                <div style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '16px' }}>Analyze, convert, visualize, or optimize your code — just tell me what you need.</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                     <span className="pill"><Paperclip size={14} style={{marginRight:4}} /> Add document</span>
                     <span className="pill"><Robot size={14} style={{marginRight:4}} /> Analyze</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 3 */}
        <div className="service-row">
          <div className="service-content">
            <h2 className="service-title">Time Estimation</h2>
            <p className="service-desc">
              Get instant estimates for development time based on your code. Make better decisions and stay ahead of deadlines.
            </p>
            <div className="service-tags">
              <span className="service-tag"><TrendUp size={20} /> Source</span>
              <span className="service-tag"><PenNib size={20} /> Analysis</span>
            </div>
          </div>
          
          <div className="service-visual glass">
             <div className="visual-content">
                 <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                     <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500, paddingBottom: 16, borderBottom: '2px solid var(--accent-purple)', marginBottom: -17 }}>Code Intelligence</span>
                 </div>
                 <div className="task-item" style={{ padding: '12px 0' }}>
                     <div>
                         <div style={{ color: '#fff', fontSize: '14px' }}>Structure Analysis</div>
                         <div style={{ color: '#a1a1aa', fontSize: '12px' }}>Deep insights into your code logic</div>
                     </div>
                     <span style={{ background: '#9333ea20', color: '#d8b4fe', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>✔ Verified</span>
                 </div>
                 <div className="task-item" style={{ padding: '12px 0' }}>
                     <div>
                         <div style={{ color: '#fff', fontSize: '14px' }}>Language Transformation</div>
                         <div style={{ color: '#a1a1aa', fontSize: '12px' }}>Converted across languages</div>
                     </div>
                     <span style={{ background: '#9333ea20', color: '#d8b4fe', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>✔ Ready</span>
                 </div>
                 <div className="task-item" style={{ padding: '12px 0' }}>
                     <div>
                         <div style={{ color: '#fff', fontSize: '14px' }}>Flow Visualization</div>
                         <div style={{ color: '#a1a1aa', fontSize: '12px' }}>Interactive flowchart generated</div>
                     </div>
                     <span style={{ background: '#22c55e20', color: '#86efac', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>✔ Completed</span>
                 </div>
                 <div className="task-item" style={{ padding: '12px 0' }}>
                     <div>
                         <div style={{ color: '#fff', fontSize: '14px' }}>Time Prediction</div>
                         <div style={{ color: '#a1a1aa', fontSize: '12px' }}>Estimated development effort</div>
                     </div>
                     <span style={{ background: '#eab30820', color: '#fde047', padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>⏳ Processing</span>
                 </div>
             </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
