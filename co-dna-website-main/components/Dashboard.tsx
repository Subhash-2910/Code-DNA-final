'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  TrendUp, Clock, CurrencyInr, ShieldCheck, User, Code, 
  Lightning, ArrowRight, Gear, IdentificationCard, ChartLineUp,
  Files, ArrowsLeftRight, BugBeetle
} from '@phosphor-icons/react';
import './Dashboard.css';

// Mock data for graphs
const usageData = [
  { name: 'Mon', usage: 12, savings: 3600 },
  { name: 'Tue', usage: 19, savings: 5700 },
  { name: 'Wed', usage: 15, savings: 4500 },
  { name: 'Thu', usage: 22, savings: 6600 },
  { name: 'Fri', usage: 30, savings: 9000 },
  { name: 'Sat', usage: 10, savings: 3000 },
  { name: 'Sun', usage: 8, savings: 2400 },
];

const featureUsage = [
  { name: 'Analyze', value: 45 },
  { name: 'Convert', value: 30 },
  { name: 'Explain', value: 25 },
];

const StatCard = ({ label, value, meta, icon: Icon, color }) => (
  <div className="stat-card glass">
    <div className="stat-label flex items-center gap-2">
      {Icon && <Icon size={18} weight="bold" color={color || 'var(--accent-purple)'} />}
      <span>{label}</span>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-meta">{meta}</div>
  </div>
);

const ActivityItem = ({ title, time, icon: Icon }) => (
  <div className="activity-item">
    <div className="activity-icon">
      <Icon size={18} weight="bold" />
    </div>
    <div className="activity-content">
      <div className="activity-title">{title}</div>
      <div className="activity-time">{time}</div>
    </div>
    <ArrowRight size={14} color="#71717a" />
  </div>
);

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const userName = user?.email?.split('@')[0] || 'Developer';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Jan 2024';

  return (
    <section className="dashboard-container">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back, <span className="text-gradient">{userName}</span>
            </h1>
            <p className="text-zinc-400">Your Code Intelligence Dashboard — Tracking your engineering impact.</p>
          </div>
          <div className="flex gap-4">
            <button className="pill glass px-6 py-2 hover:bg-white/10 transition">
              <Gear size={18} className="mr-2" /> Settings
            </button>
            <button className="btn-primary">
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Top Row Stats */}
          <div className="stats-grid">
            <StatCard 
              label="Credits Left" 
              value="8 / 12" 
              meta="2 days until reset" 
              icon={Lightning}
              color="#fbbf24"
            />
            <StatCard 
              label="Total Analyses" 
              value="142" 
              meta="+12 this week" 
              icon={BarChart}
              color="#9333ea"
            />
            <StatCard 
              label="Time Saved" 
              value="46 hrs" 
              meta="≈ 5.2 working days" 
              icon={Clock}
              color="#3b82f6"
            />
            <StatCard 
              label="Money Saved" 
              value="₹27,600" 
              meta="Calculated at ₹600/hr" 
              icon={CurrencyInr}
              color="#10b981"
            />
          </div>

          {/* Main Chart Area */}
          <div className="chart-container glass">
            <div className="chart-header">
              <h3 className="text-xl font-bold">Cost Saved Over Time</h3>
              <div className="flex gap-2">
                <button className="pill px-3 py-1 bg-white/5 text-xs">Last 7 Days</button>
                <button className="pill px-3 py-1 bg-transparent text-xs hover:bg-white/5 opacity-50">Last 30 Days</button>
              </div>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(9, 9, 11, 0.95)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff'
                    }}
                    itemStyle={{ color: 'var(--accent-purple)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="var(--accent-purple)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSavings)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <ChartLineUp size={24} color="#10b981" />
                  <h4 className="font-bold">Code DNA Score</h4>
                </div>
                <div className="text-3xl font-bold mb-2">84 <span className="text-sm text-zinc-500">/ 100</span></div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-emerald-500 h-full" style={{ width: '84%' }}></div>
                </div>
                <p className="mt-4 text-xs text-zinc-400">You are in the top 5% of optimized codebases this month.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={24} color="#3b82f6" />
                  <h4 className="font-bold">Security Alerts</h4>
                </div>
                <div className="text-3xl font-bold mb-2 text-emerald-400">0</div>
                <p className="mt-4 text-xs text-zinc-400">No vulnerabilities detected in your last 42 analyses.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="profile-card glass">
              <div className="avatar-large">
                <User size={40} weight="bold" />
              </div>
              <div className="profile-name">{userName}</div>
              <div className="profile-email">{user?.email || 'user@example.com'}</div>
              <div className="pill bg-[#9333ea20] text-purple-400 border-purple-500/30 px-4 py-1 mb-6">
                Pro Developer
              </div>
              
              <div className="dev-identity">
                <div className="identity-item">
                  <span className="identity-label">Primary Language</span>
                  <span className="identity-value">TypeScript</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Avg. Code Density</span>
                  <span className="identity-value">Medium</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Productivity Boost</span>
                  <span className="identity-value text-emerald-400">+42%</span>
                </div>
                <div className="identity-item">
                   <span className="identity-label">Member Since</span>
                   <span className="identity-value">{memberSince}</span>
                </div>
              </div>
            </div>

            <div className="activity-card glass">
              <h3 className="font-bold mb-4">Recent Intelligence</h3>
              <div className="activity-list">
                <ActivityItem title="Analyzed 'Playground.tsx'" time="2 hours ago" icon={BugBeetle} />
                <ActivityItem title="Converted Python → Go" time="5 hours ago" icon={ArrowsLeftRight} />
                <ActivityItem title="Modernized legacy login" time="Yesterday" icon={Code} />
                <ActivityItem title="Generated logic flowchart" time="2 days ago" icon={Files} />
              </div>
              <button className="w-full mt-6 text-sm text-zinc-500 hover:text-white transition flex items-center justify-center gap-2">
                View All History <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
