# CO-DNA — AI-Powered Technical Debt Intelligence Platform

> **Kill technical debt — from inside your editor.**

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-1a1aff?style=flat-square&logo=visual-studio-code)](https://marketplace.visualstudio.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Beta-orange?style=flat-square)]()

---

## The Problem

Technical debt is invisible — but extremely expensive.

| Metric | Reality |
|---|---|
| Developer time wasted | **33%** spent managing debt |
| Annual cost per enterprise | **Millions** in lost productivity |
| Security risks | Go unnoticed until it's too late |
| Leadership visibility | Near zero — no business-level metrics |

Teams cannot **measure**, **prioritize**, or **communicate** technical debt effectively. CO-DNA fixes that.

---

## What is CO-DNA?

CO-DNA is an **AI-powered VS Code extension + backend intelligence system** that:

- ✅ Quantifies technical debt in real money (**$**)
- ✅ Detects security vulnerabilities in **real-time**
- ✅ Explains and visualizes code like a **senior engineer**
- ✅ Suggests modern rewrites and **optimizations**
- ✅ Bridges developer insights → **business decisions**

---

## Core Capabilities

### 🔍 Technical Debt Scanner
AST-based static analysis that detects complexity, code duplication, and anti-patterns.

**Outputs:**
- Weighted Debt Score (0–100)
- Dollar cost estimation
- Prioritized refactoring roadmap

### 🔐 Security Intelligence
Real-time alerts for:
- Hardcoded secrets and API keys
- SQL injection vulnerabilities
- Unsafe patterns (`eval`, dynamic execution)
- Vulnerable dependencies (CVE matching)

### 🧠 AI Code Understanding
Powered by Claude & Gemini APIs. Generates:
- Plain-English function summaries
- Flow diagrams and architecture insights
- Inline explanations on demand

### ⚡ Code Modernization
Converts legacy patterns to modern equivalents — improving readability, performance, and long-term maintainability.

### 🔁 Code Rewrite Engine
Rewrites entire modules, optimizing for:
- Performance
- Security posture
- Structure and readability

### 🌍 Code Translator
Converts code across languages (Python → TypeScript, Java → Go, etc.) while preserving full logic and structure.

---

## Business Intelligence Layer

CO-DNA speaks both **developer** and **business** — the only tool that translates code quality into dollar impact.

**For Developers:**
- Fix suggestions with exact remediation steps
- Inline code explanations on hover
- Real-time security alerts in the editor

**For Engineering Managers:**
- Cost of debt in real dollar estimates
- Productivity impact per module
- Risk visibility across the entire codebase

### CO-DNA vs Traditional Tools

| Capability | Traditional Tools | CO-DNA |
|---|---|---|
| Output type | Code issue list | 💰 Business impact in dollars |
| Analysis method | Static metrics only | 🧠 AI reasoning + static analysis |
| Audience | Developers only | 👨‍💻 Dev + 🧑‍💼 Management |
| Security | Separate tool required | ✅ Built-in, real-time alerts |
| Prioritization | Manual, subjective | 🤖 Cost-weighted, automated |

---

## Architecture

```
User (VS Code)
      │
      ▼
Extension UI (React Webview)
      │
      ▼
Backend API (Node.js / Express)
      │
      ▼
  ┌───┴───┐
  │ Model │
  │Selector│
  └───┬───┘
      │
 ┌────┴─────┐
 │          │
 ▼          ▼
Low-Level   High-Level
 Model       AI Model
(Static     (LLM Reasoning:
Analysis)    Claude / Gemini)
 │          │
 ▼          ▼
Metrics   Insights +
+ Scores  Suggestions
      │
      ▼
Final Intelligence Report
(Rendered in VS Code Webview)
```

**Design principle:** Lightweight static analysis handles metrics at speed; the high-level AI model handles reasoning and language-level insights. The Model Selector routes each task to the right engine automatically.

---

## Scoring Logic

All metrics are transparent and auditable — no black-box scoring.

```
Complexity   = 1 + Σ(decision points in function)

ETA          = (Lines of Code / 50) × ComplexityFactor

Cost         = ETA × DeveloperRate × RiskFactor

Debt Score   = Normalize(Complexity + Duplication + Maintainability)
               → Range: 0 (clean) to 100 (critical)
```

---

## Project Structure

```
co-dna/                              # Root repository
│
├── co-dna/                          # VS Code Extension
│   ├── src/
│   │   ├── extension.ts             # Activation entrypoint
│   │   ├── analyzer.ts              # AST-based scanner
│   │   └── commands/                # Registered VS Code commands
│   ├── webview/                     # React-based panel UI
│   │   ├── DebtReport.tsx
│   │   ├── SecurityPanel.tsx
│   │   └── ExplainView.tsx
│   └── dist/                        # Compiled output
│
├── debtsight-backend/               # Backend API — Node.js / Express
│   ├── routes/                      # /analyze, /explain, /rewrite
│   ├── services/
│   │   ├── debtService.ts
│   │   ├── securityService.ts
│   │   └── aiService.ts
│   └── controllers/                 # Request handlers
│
├── model-low-level/                 # Static analysis engine
│   ├── astParser.ts
│   ├── complexityScorer.ts
│   └── duplicationDetector.ts
│
├── model-high-level/                # AI reasoning layer
│   ├── promptBuilder.ts             # Prompt engineering
│   ├── geminiAdapter.ts
│   └── claudeAdapter.ts
│
├── website-launch/                  # Landing page
└── assets/                          # Screenshots & visuals
```

---

## Tech Stack

**Extension / Frontend**
- VS Code Extension API
- TypeScript
- React (Webview UI)
- Tailwind CSS

**Backend**
- Node.js 18+
- Express
- TypeScript

**AI Layer**
- Claude API (Anthropic)
- Gemini API (Google)
- Prompt Engineering
- Hybrid Model Design (static + LLM)

---

## Local Setup

### 1. Start the Backend

```bash
cd debtsight-backend
npm install
npm start
# Server starts on http://localhost:3000
```

### 2. Build the VS Code Extension

```bash
cd co-dna
npm install
npm run compile
```

### 3. Launch in VS Code

Open the `co-dna/` folder in VS Code, then press **F5** to launch the Extension Development Host. The CO-DNA panel will appear in your activity bar.

---

## Business Model

| Plan | Price | Includes |
|---|---|---|
| **Free** | $0 / forever | Basic debt analysis, complexity scoring, 5 scans/day |
| **Pro** | $29 / seat / month | Full AI insights, cost modeling, security intelligence, unlimited scans |
| **Enterprise** | Custom | All Pro features + dashboards, CI/CD integration, GitHub integration, SSO |

---

## Roadmap

- [ ] **CI/CD Integration** — Automated debt reports on every pull request; block merges above debt thresholds
- [ ] **GitHub Native Integration** — Debt scores directly in PRs and code review workflows
- [ ] **Team Analytics Dashboard** — Portfolio-level debt tracking across repos and teams
- [ ] **Cloud SaaS Platform** — Hosted web app with multi-repo scanning and executive reporting

---

## Target Audience

- 👨‍💻 **Developers** — Fix debt faster with AI-powered suggestions and real-time security alerts
- 🧑‍💼 **Engineering Managers** — Get dollar-value visibility into technical risk
- 🏢 **Startups & Enterprises** — Reduce the hidden cost of legacy systems

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

> *"You can't fix what you can't measure."*
> **CO-DNA makes technical debt measurable, actionable, and visible.**

⭐ **Star this repo if it helps your team!**
