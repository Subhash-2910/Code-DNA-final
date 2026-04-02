// ─────────────────────────────────────────────
//  Co-DNA · extension.ts
//  3 modes: scan | explain | translate
//  + button: file picker + project picker
//  API: https://co-dna-fullproject.onrender.com (default)
// ─────────────────────────────────────────────

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getApiBaseUrl, getModelLabel } from "./config";
import { buildPanelHtml } from "./webviewPanel";
import type {
  Mode,
  WebviewMessage,
  ScanResponse,
  ExplainResponse,
  TranslateResponse,
} from "./types";

// ── Activate ──────────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  console.log("Co-DNA is active. Backend:", getApiBaseUrl());

  const open = vscode.commands.registerCommand("co-dna.open", () =>
    createPanel(context)
  );
  const scan = vscode.commands.registerCommand("co-dna.analyzeDebt", () =>
    createPanel(context, "scan")
  );
  const explain = vscode.commands.registerCommand("co-dna.explainCode", () =>
    createPanel(context, "explain")
  );
  const translate = vscode.commands.registerCommand("co-dna.translateCode", () =>
    createPanel(context, "translate")
  );

  context.subscriptions.push(open, scan, explain, translate);
}

// ── Panel factory ─────────────────────────────────────────────────────────────

function createPanel(context: vscode.ExtensionContext, initialMode?: Mode): void {
  const modelLabel = getModelLabel();

  const panel = vscode.window.createWebviewPanel(
    "coDnaPanel",
    "Co-DNA",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [],
    }
  );

  panel.webview.html = buildPanelHtml(panel.webview.cspSource, modelLabel);

  // Auto-fill from active editor when opened via a mode command
  if (initialMode) {
    const editor = vscode.window.activeTextEditor;
    const code = editor?.document.getText() ?? "";
    setTimeout(() => {
      panel.webview.postMessage({
        type: "prepopulate",
        code: code.trim() ? code : "",
        mode: initialMode,
      });
    }, 500);
  }

  // ── Message handler ────────────────────────────────────────────────────────
  context.subscriptions.push(
    panel.webview.onDidReceiveMessage(async (msg: WebviewMessage) => {
      switch (msg.type) {
        case "submit":
          await handleSubmit(panel, msg.mode, msg.code, msg.targetLanguage);
          break;

        case "copy":
          await vscode.env.clipboard.writeText(msg.text);
          void vscode.window.showInformationMessage("Co-DNA: Copied to clipboard.");
          break;

        case "pickFile":
          await handlePickFile(panel);
          break;

        case "pickProject":
          await handlePickProject(panel);
          break;
      }
    })
  );
}

// ── Submit: call the right backend endpoint ───────────────────────────────────

async function handleSubmit(
  panel: vscode.WebviewPanel,
  mode: Mode,
  inputCode: string,
  targetLanguage?: string
): Promise<void> {
  let code = inputCode;

  // Fall back to active editor when input is empty
  if (!code.trim()) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      panel.webview.postMessage({
        type: "error",
        message: "No code provided and no active editor is open.",
      });
      return;
    }
    code = editor.document.getText();
    if (!code.trim()) {
      panel.webview.postMessage({
        type: "error",
        message: "The active editor file is empty. Paste some code or open a file.",
      });
      return;
    }
  }

  const base = getApiBaseUrl();
  let endpoint: string;
  let body: Record<string, unknown>;

  if (mode === "scan") {
    endpoint = "/analyze-debt";
    body = { code };
  } else if (mode === "explain") {
    endpoint = "/explain-code";
    body = { code };
  } else {
    // translate
    endpoint = "/translate-code";
    body = { code, target_language: targetLanguage ?? "Python" };
  }

  try {
    const response = await fetch(`${base}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      const errMsg = String(data?.error ?? `Backend error (${response.status})`);
      panel.webview.postMessage({ type: "error", message: errMsg });
      return;
    }

    let result: ScanResponse | ExplainResponse | TranslateResponse = data;

    // Normalise translate field — backend may return rewritten_code or modern_code
    if (mode === "translate") {
      result = {
        rewritten_code: String(
          (data as Record<string, unknown>).rewritten_code ??
          (data as Record<string, unknown>).modern_code ??
          ""
        ),
      } satisfies TranslateResponse;
    }

    panel.webview.postMessage({ type: "result", data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    panel.webview.postMessage({
      type: "error",
      message: `${msg}\n\nBackend: ${base}`,
    });
  }
}

// ── Pick single file ──────────────────────────────────────────────────────────

async function handlePickFile(panel: vscode.WebviewPanel): Promise<void> {
  const uris = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Add file to Co-DNA",
    filters: {
      "Code files": [
        "ts", "tsx", "js", "jsx", "py", "java", "cs", "cpp", "c",
        "go", "rs", "rb", "php", "swift", "kt", "vue", "html", "css",
        "json", "yaml", "yml", "toml", "sh", "bash", "sql", "md", "txt",
      ],
      "All files": ["*"],
    },
  });

  if (!uris || uris.length === 0) return;

  const uri = uris[0];
  try {
    const content = fs.readFileSync(uri.fsPath, "utf8");
    const name = path.basename(uri.fsPath);
    panel.webview.postMessage({ type: "fileLoaded", name, content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    void vscode.window.showErrorMessage(`Co-DNA: Could not read file — ${msg}`);
  }
}

// ── Pick entire project folder ────────────────────────────────────────────────

const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".java", ".cs", ".cpp", ".c", ".h", ".hpp",
  ".go", ".rs", ".rb", ".php", ".swift", ".kt",
  ".vue", ".svelte", ".html", ".css", ".scss", ".less",
  ".json", ".yaml", ".yml", ".toml", ".sh", ".bash", ".sql",
]);

const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".vscode", "dist", "build", "out",
  ".next", ".nuxt", "__pycache__", ".pytest_cache", "vendor",
  "coverage", ".nyc_output", "target", "bin", "obj",
]);

const MAX_PROJECT_CHARS = 120_000; // ~30k tokens — keep prompts sane

function collectProjectFiles(dir: string): string {
  const parts: string[] = [];
  let totalChars = 0;

  function walk(current: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".env.example") continue;
      if (IGNORE_DIRS.has(entry.name)) continue;

      const fullPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!CODE_EXTENSIONS.has(ext)) continue;

        try {
          const content = fs.readFileSync(fullPath, "utf8");
          const relative = path.relative(dir, fullPath);
          const block = `// ── ${relative} ──\n${content}`;
          if (totalChars + block.length > MAX_PROJECT_CHARS) return;
          parts.push(block);
          totalChars += block.length;
        } catch {
          // skip unreadable files
        }
      }
    }
  }

  walk(dir);
  return parts.join("\n\n");
}

async function handlePickProject(panel: vscode.WebviewPanel): Promise<void> {
  // Default to the first workspace folder if available
  const defaultUri = vscode.workspace.workspaceFolders?.[0]?.uri;

  const uris = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    defaultUri,
    openLabel: "Add project folder to Co-DNA",
  });

  if (!uris || uris.length === 0) return;

  const folderUri = uris[0];
  const folderPath = folderUri.fsPath;
  const folderName = path.basename(folderPath);

  try {
    const content = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Co-DNA: Reading project "${folderName}"…`,
        cancellable: false,
      },
      async () => collectProjectFiles(folderPath)
    );

    if (!content.trim()) {
      void vscode.window.showWarningMessage(
        `Co-DNA: No readable code files found in "${folderName}".`
      );
      return;
    }

    panel.webview.postMessage({
      type: "projectLoaded",
      name: folderName,
      content,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    void vscode.window.showErrorMessage(`Co-DNA: Could not read project — ${msg}`);
  }
}

export function deactivate(): void {}
