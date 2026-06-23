import { useCallback, useEffect, useRef, useState } from "react";
import { PaddleOcrService, type RecognitionResult } from "ppu-paddle-ocr/mobile";

import { pushLog } from "../logging/logStore";
import { DEFAULT_MODEL_CHOICE, MODEL_CHOICES, type ModelChoice } from "../ocr/presets";

export type OcrStatus = "initializing" | "ready" | "running" | "done" | "error";

export type OcrResult = {
  text: string;
  confidence: number;
  ms: number;
  model: string;
  items: RecognitionResult[];
};

export type UseOcr = {
  status: OcrStatus;
  result: OcrResult | null;
  error: string | null;
  modelKey: string;
  models: ModelChoice[];
  selectModel: (key: string) => void;
  recognize: (buffer: ArrayBuffer) => Promise<void>;
};

/**
 * Owns a single PaddleOcrService and rebuilds it whenever the selected model
 * preset changes (initialize() downloads that preset's models on first use and
 * caches them afterwards). Recognition runs on caller-supplied image bytes so
 * the same service works for the bundled receipt, a library pick, or a camera
 * capture. `verbose` pipeline logs are surfaced via the shared log store.
 */
export function useOcr(): UseOcr {
  const serviceRef = useRef<PaddleOcrService | null>(null);
  const [status, setStatus] = useState<OcrStatus>("initializing");
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelKey, setModelKey] = useState<string>(DEFAULT_MODEL_CHOICE.key);

  useEffect(() => {
    let cancelled = false;
    const choice = MODEL_CHOICES.find((m) => m.key === modelKey) ?? DEFAULT_MODEL_CHOICE;
    const service = new PaddleOcrService({
      model: choice.model,
      debugging: { verbose: true },
    });
    serviceRef.current = service;

    setStatus("initializing");
    setResult(null);
    setError(null);
    pushLog("info", `[model] initializing "${choice.label}"…`);

    void (async () => {
      try {
        await service.initialize();
        if (cancelled) return;
        setStatus("ready");
        pushLog("info", `[model] "${choice.label}" ready`);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setStatus("error");
        pushLog("error", `[model] init failed: ${message}`);
      }
    })();

    return () => {
      cancelled = true;
      void service.destroy();
      serviceRef.current = null;
    };
  }, [modelKey]);

  const selectModel = useCallback(
    (key: string) => {
      if (key === modelKey || status === "running") return;
      setModelKey(key);
    },
    [modelKey, status],
  );

  const recognize = useCallback(async (buffer: ArrayBuffer): Promise<void> => {
    const service = serviceRef.current;
    if (!service || !service.isInitialized()) {
      pushLog("warn", "[ocr] model not ready yet");
      return;
    }

    try {
      setStatus("running");
      setError(null);
      pushLog("info", `[ocr] recognizing ${(buffer.byteLength / 1024).toFixed(0)} KB…`);

      const start = Date.now();
      const ocr = await service.recognize(buffer, { flatten: true });
      const ms = Date.now() - start;

      setResult({
        text: ocr.text,
        confidence: ocr.confidence,
        ms,
        model: modelKey,
        items: ocr.results,
      });
      setStatus("done");
      pushLog(
        "info",
        `[ocr] done in ${ms} ms · ${(ocr.confidence * 100).toFixed(1)}% · ${ocr.text.length} chars`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setStatus("error");
      pushLog("error", `[ocr] failed: ${message}`);
    }
  }, [modelKey]);

  return { status, result, error, modelKey, models: MODEL_CHOICES, selectModel, recognize };
}
