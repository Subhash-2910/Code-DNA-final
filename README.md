# 🧬 CO-DNA

### Kill Technical Debt — From Inside Your Editor

[![Hackathon](https://img.shields.io/badge/HACK'A'WAR-2026-blue)](https://msrit.edu)
[![AI Powered](https://img.shields.io/badge/AI-LLM_Integrated-purple)]()
[![VS Code](https://img.shields.io/badge/Platform-VS_Code-blue)]()

> 🚀 Built for **HACK'A'WAR 2026** — Problem Statement: *Technical Debt Quantifier*

---

# 🚨 The Problem

Technical debt is one of the most expensive invisible problems in software engineering.

* ⏱️ **33% of developer time** is wasted navigating poor code
* 💸 Costs scale to **millions annually** for mid-sized teams
* 👁️ **Zero visibility** for leadership until failure

👉 Teams **cannot measure**, **prioritize**, or **justify fixing** technical debt.

---

# 💡 The Solution — CO-DNA

CO-DNA is an **AI-powered VS Code extension** that:

✔ Quantifies technical debt in **real money ($)**
✔ Explains complex code instantly
✔ Transforms legacy code into modern patterns

All **without leaving your editor**.

---

# 🚀 Core Features

## 1. 🔍 Debt Scanner

* AST-based code analysis
* Detects:

  * Complexity
  * Code duplication
  * Anti-patterns
* Converts findings into:

  * 📊 Technical Debt Score
  * 💰 Estimated Business Cost

---

## 2. 🧠 Code Explainer

* Select any code → get plain English explanation
* Ideal for:

  * New developers
  * Large codebases
* Reduces onboarding time by **10x**

---

## 3. ⚡ Code Modernizer

* Converts legacy → modern code
* Examples:

  * Callbacks → Async/Await
  * Old syntax → ES6+
* Improves maintainability instantly

---

# 🏗️ System Architecture

CO-DNA is built as a **multi-layer intelligent system**:

```
User (VS Code)
      ↓
Extension (Frontend + Webview UI)
      ↓
Backend API (Node.js / Express)
      ↓
AI Layer (LLMs + Custom Models)
      ↓
Analysis Engine (AST + Metrics)
```

---

# 🧩 Project Structure

```
co-dna/
│
├── co-dna/                     # VS Code Extension
│   ├── src/
│   ├── webview/               # React UI
│   └── dist/
│
├── debtsight-backend/         # Main Backend API (Node.js)
│   ├── routes/
│   ├── services/
│   └── controllers/
│
├── model-low-level/           # Fast, lightweight analysis
│   ├── static analysis
│   └── rule-based scoring
│
├── model-high-level/          # Advanced AI reasoning
│   ├── LLM prompts
│   └── deep code understanding
│
├── website-launch/            # Landing page / product site
│   ├── frontend
│   └── marketing assets
```

---

# ⚙️ Tech Stack

## 🖥️ Frontend (Extension)

* VS Code Extension API
* TypeScript
* React (Webview UI)
* Tailwind CSS

## 🧠 Backend

* Node.js
* Express.js
* REST APIs

## 🤖 AI / Models

* LLM APIs (Gemini / Claude / others)
* Custom prompt engineering
* Hybrid analysis:

  * Rule-based (low-level)
  * AI reasoning (high-level)

## 🗄️ Future Scope

* DynamoDB (debt tracking over time)
* Team dashboards
* CI/CD integration

---

# 🧪 Local Setup

## 1️⃣ Start Backend

```bash
cd debtsight-backend
npm install
npm start
```

---

## 2️⃣ Run VS Code Extension

```bash
cd co-dna
npm install
npm run compile
```

Then:

👉 Open in VS Code
👉 Press **F5 (Run Extension)**

---

## 3️⃣ (Optional) Run Models

### Low-Level Model

```bash
cd model-low-level
# run analysis engine
```

### High-Level Model

```bash
cd model-high-level
# run AI-powered reasoning
```

---

## 4️⃣ Run Website

```bash
cd website-launch
npm install
npm run dev
```

---

# 🎯 Key Innovation

CO-DNA bridges the gap between:

| Technical View | Business View        |
| -------------- | -------------------- |
| Code Smells    | 💰 Dollar Impact     |
| Complexity     | 📉 Productivity Loss |
| Refactoring    | 📈 ROI Justification |

---

# 📈 Impact

* Makes technical debt **visible**
* Helps teams **prioritize fixes**
* Enables **data-driven engineering decisions**
* Saves **millions in long-term cost**

---

# 🔮 Future Roadmap

* 📊 Team dashboards & analytics
* 🔄 GitHub / CI integration
* 🧠 Fine-tuned custom models
* 🏢 Enterprise SaaS version

---

# 👨‍💻 Team

Built with passion during **HACK'A'WAR 2026**

---

# 🏁 Final Note

> “You can’t fix what you can’t measure.”
> CO-DNA makes technical debt measurable, actionable, and impossible to ignore.

---
