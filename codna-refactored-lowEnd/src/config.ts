import * as vscode from "vscode";

const SECTION = "co-dna";

/** Base URL of the deployed Co-DNA backend on Render (no trailing slash). */
export const LOCAL_URL = "http://localhost:8000";

export function getApiBaseUrl(): string {
  const raw = vscode.workspace
    .getConfiguration(SECTION)
    .get<string>("apiBaseUrl", LOCAL_URL)
    .trim();
  return raw.replace(/\/+$/, "");
}

export function getModelLabel(): string {
  return vscode.workspace
    .getConfiguration(SECTION)
    .get<string>("modelLabel", "Amazon Nova · DebtSight")
    .trim();
}
