# Co-DNA v2.0

> AI-powered code analysis for VS Code — **Scan · Explain · Translate**

Co-DNA connects your VS Code editor to the DebtSight backend (Gemini-powered) and gives you three focused, premium tools inside a single unified panel.

---

## Modes

### 📡 Scan — Technical Debt Analysis
Paste code or open a file → get a full technical debt report:

| Output | Description |
|--------|-------------|
| **Spaghetti Score** | 0-100, higher = worse. Weighted from complexity, duplication, deps |
| **Security Score** | 0-100, higher = worse. Secrets, eval, SQL injection, TLS issues |
| **Complexity Score** | Cyclomatic + nesting + function count |
| **Risk Level** | `LOW / MEDIUM / HIGH / CRITICAL` |
| **Findings** | Each issue: title, severity chip, description, file:line location |
| **Business Impact** | Estimated remediation cost ($) and engineering hours |
| **Mermaid Diagrams** | Logic flow, Architecture, Function interactions |
| **Refactor Plan** | Numbered steps with rationale and example code changes |

### 🧠 Explain — Code Understanding
Paste code or ask a question in natural language:

| Output | Description |
|--------|-------------|
| **Explanation** | Plain-English summary for junior devs |
| **Flowchart** | Mermaid diagram of execution logic, function flow, architecture |

### 🔄 Translate — Language Conversion
Paste code + pick a target language → get idiomatic production code:

| Output | Description |
|--------|-------------|
| **Translated Code** | Full, idiomatic code in the target language |
| **Copy Button** | One-click clipboard copy |

Supported target languages: Python · JavaScript · TypeScript · Java · C++ · C# · Go · Rust · PHP · Ruby · Swift · Kotlin

---

## Architecture

```
VS Code Extension (extension.ts)
  │
  ├── Opens webviewPanel.ts  ← Full React-like UI rendered as HTML/JS
  │
  └── Message bridge (postMessage)
        │
        ↓
  Co-DNA Backend (Node.js / Express)
        │
        ├── POST /analyze-debt    ← Scan
        ├── POST /explain-code    ← Explain  
        └── POST /translate-code  ← Translate
              │
              └── Gemini API (geminiService.js)
```

### Data flow
1. User types code (or leaves blank → active editor is used)
2. Webview sends `postMessage({ type: 'submit', mode, code, targetLanguage })`
3. Extension POSTs to the backend
4. Backend runs static analysis + Gemini AI prompt
5. Extension sends `postMessage({ type: 'result', data })` back to webview
6. Webview renders mode-specific result cards

---

## Project Structure

```
co-dna/
├── src/
│   ├── extension.ts        # VS Code extension entry, command handlers, message bridge
│   ├── webviewPanel.ts     # Full UI: CSS + HTML template + embedded JS
│   ├── types.ts            # Strict TypeScript types (Mode, API responses)
│   ├── api.ts              # fetch helper
│   └── config.ts           # VS Code settings reader
├── package.json            # 3 commands, no dead modes
├── tsconfig.json
└── esbuild.js

debtsight-backend/          # (separate repo)
├── controllers/
│   └── aiController.js     # analyzeDebt | explainCode | translateCode
├── routes/
│   └── aiRoutes.js         # 3 routes only
├── ai.js                   # Prompt builders (add buildTranslateCodePrompt)
├── services/
│   └── geminiService.js    # Gemini API wrapper
└── utils/                  # Static analyzers, security, business impact, etc.
```

---

## Setup

### 1. Backend

```bash
cd debtsight-backend
cp .env.example .env          # Add your GEMINI_API_KEY
npm install
node server.js                # Starts on http://localhost:3000
```

**Required `.env` keys:**
```
GEMINI_API_KEY=your_key_here
PORT=3000
HOURLY_RATE=50                # Used for dollar impact calculation
```

**Backend changes needed** (see `backend-additions/`):

1. Add `buildTranslateCodePrompt` to `ai.js`
2. Add `translateCode` controller to `controllers/aiController.js`
3. Replace `routes/aiRoutes.js` with the 3-route version

### 2. Extension

```bash
cd co-dna
npm install
npm run compile               # or: npm run watch for dev
```

Then press `F5` in VS Code to launch the Extension Development Host.

### 3. Settings

In VS Code settings (`Cmd/Ctrl+,`), search **Co-DNA**:

| Setting | Default | Description |
|---------|---------|-------------|
| `co-dna.apiBaseUrl` | `http://localhost:3000` | Backend URL |
| `co-dna.modelLabel` | `Gemini · Co-DNA` | Label shown in panel |

---

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `Co-DNA: Open Panel` | Right-click any editor | Opens the unified panel |
| `Co-DNA: Scan — Analyze Technical Debt` | Right-click | Opens panel in Scan mode |
| `Co-DNA: Explain Code` | Right-click | Opens panel in Explain mode |
| `Co-DNA: Translate Code` | Right-click | Opens panel in Translate mode |

When opened via a mode-specific command, the active editor's code is auto-filled and submitted immediately.

---

## TypeScript Types

```typescript
// Strict — Mode is exactly 3 values, nothing else.
type Mode = "scan" | "explain" | "translate";

// Scan output
interface ScanResponse {
  spaghetti_score?: number;       // 0-100
  complexity_score?: number;      // 0-100
  security_score?: number;        // 0-100
  risk_level?: string;            // "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  issues?: ScanIssue[];
  security_issues?: Record<string, unknown>[];
  business_impact?: ScanBusinessImpact;
  refactor_plan?: RefactorStep[];
  logic_flow_diagram?: string;    // Mermaid
  architecture_diagram?: string;  // Mermaid
  function_flow_diagram?: string; // Mermaid
}

// Explain output
interface ExplainResponse {
  explanation?: string;
  flowchart?: string;             // Mermaid
  function_flow_diagram?: string;
  architecture_diagram?: string;
}

// Translate output
interface TranslateResponse {
  rewritten_code?: string;
}
```

---

## UI Design

The panel uses:
- **Syne** (Google Fonts) — display font for labels, tabs, headers
- **JetBrains Mono** — all code blocks and score numbers  
- VS Code CSS variables throughout — auto-adapts to any theme (dark/light)
- Mermaid v10 (CDN) — diagram rendering
- Zero runtime dependencies in the webview beyond Mermaid

Score bars, severity chips, risk badges, and the dollar impact card all use color-coded semantics:

| Color | Meaning |
|-------|---------|
| 🔴 Red (`#f87171`) | High/Critical severity, danger score |
| 🟡 Yellow (`#fbbf24`) | Medium severity, warning score |
| 🟠 Orange (`#f97316`) | Moderate score |
| 🟢 Green (`#34d399`) | Low severity, healthy score |
| 🟣 Purple (`#7C6AF7`) | Accent, dollar impact |

---

## Removed from v1.x

These modes no longer exist anywhere in the codebase:
- ~~Modernize~~ (`/modernize-code`, `buildModernizeCodePrompt`)
- ~~Rewrite~~ (`/rewrite-codebase`, `buildRewriteCodebasePrompt`)

If you need them, they remain in `debtsight-backend/` but are not wired to any UI route.
