import { useSyncExternalStore } from "react";

export type LogLevel = "info" | "warn" | "error";
export type LogLine = { id: number; at: number; level: LogLevel; msg: string };

const MAX_LINES = 300;

let lines: LogLine[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

export function pushLog(level: LogLevel, msg: string): void {
  lines = [...lines, { id: nextId++, at: Date.now(), level, msg }];
  if (lines.length > MAX_LINES) lines = lines.slice(-MAX_LINES);
  emit();
}

export function clearLogs(): void {
  lines = [];
  emit();
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): LogLine[] {
  return lines;
}

export function useLogs(): LogLine[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}

function format(arg: unknown): string {
  if (typeof arg === "string") return arg;
  if (arg instanceof Error) return arg.message;
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

let captured = false;

/**
 * Mirror console output into the in-app log panel so the library's
 * `verbose` pipeline logs (download, detection, recognition) are visible on
 * device, not just in the Metro terminal. The original console is preserved.
 */
export function installConsoleCapture(): void {
  if (captured) return;
  captured = true;

  (["log", "info", "warn", "error"] as const).forEach((method) => {
    const original = console[method].bind(console);
    console[method] = (...args: unknown[]) => {
      const level: LogLevel = method === "warn" ? "warn" : method === "error" ? "error" : "info";
      pushLog(level, args.map(format).join(" "));
      original(...args);
    };
  });
}
