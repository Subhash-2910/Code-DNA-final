// ─────────────────────────────────────────────
//  Co-DNA — Type Definitions
//  Mode is exactly 3 values. Nothing else.
// ─────────────────────────────────────────────

export type Mode = "scan" | "explain" | "translate";

// ── SCAN (POST /analyze-debt) ─────────────────

export interface ScanIssue {
  title?: string;
  severity?: "low" | "medium" | "high" | "critical";
  details?: string;
  location?: string;
}

export interface ScanBusinessImpact {
  estimated_effort_hours?: number;
  estimated_cost?: number;
  severity?: string;
}

export interface ScanResponse {
  spaghetti_score?: number;
  complexity_score?: number;
  security_score?: number;
  risk_level?: string;
  issues?: ScanIssue[];
  security_issues?: Array<Record<string, unknown>>;
  explanation?: string;
  business_impact?: ScanBusinessImpact;
  refactor_plan?: Array<{ step?: string; why?: string; example_change?: string }>;
  logic_flow_diagram?: string;
  architecture_diagram?: string;
  function_flow_diagram?: string;
  flowchart?: string;
  ai_partial?: boolean;
}

// ── EXPLAIN (POST /explain-code) ──────────────

export interface ExplainResponse {
  explanation?: string;
  flowchart?: string;
  function_flow_diagram?: string;
  architecture_diagram?: string;
  logic_flow_diagram?: string;
}

// ── TRANSLATE (POST /translate-code) ──────────

export interface TranslateResponse {
  rewritten_code?: string;
}

// ── Webview ↔ Extension messages ──────────────

export interface SubmitMessage {
  type: "submit";
  mode: Mode;
  code: string;
  targetLanguage?: string;
}

export interface CopyMessage {
  type: "copy";
  text: string;
}

export interface PickFileMessage {
  type: "pickFile";
}

export interface PickProjectMessage {
  type: "pickProject";
}

export type WebviewMessage =
  | SubmitMessage
  | CopyMessage
  | PickFileMessage
  | PickProjectMessage;
