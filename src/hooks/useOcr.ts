import { useEffect, useRef, useState } from "react";
import { Asset } from "expo-asset";
import { PaddleOcrService } from "ppu-paddle-ocr/mobile";

// Bundled sample image. Replace with a frame from expo-camera /
// react-native-vision-camera to OCR a live capture.
const receiptModule = require("../../assets/receipt.jpg");

export type OcrStatus = "initializing" | "ready" | "running" | "done" | "error";

export type OcrResult = {
  text: string;
  confidence: number;
  ms: number;
};

export type UseOcr = {
  status: OcrStatus;
  result: OcrResult | null;
  error: string | null;
  runOcr: () => Promise<void>;
};

/**
 * Owns a single PaddleOcrService for the app's lifetime: initializes it on
 * mount (downloading the default PP-OCRv6 small models on first run) and runs
 * recognition on the bundled receipt on demand.
 */
export function useOcr(): UseOcr {
  const serviceRef = useRef<PaddleOcrService | null>(null);
  const [status, setStatus] = useState<OcrStatus>("initializing");
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const service = new PaddleOcrService();
    serviceRef.current = service;

    void (async () => {
      try {
        // Downloads detection + recognition models and the dictionary over the
        // network on first run (~30 MB for the v6 small default).
        await service.initialize();
        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      void service.destroy();
      serviceRef.current = null;
    };
  }, []);

  const runOcr = async (): Promise<void> => {
    const service = serviceRef.current;
    if (!service || status === "initializing" || status === "running") return;

    try {
      setStatus("running");
      setError(null);

      // Resolve the bundled asset to a local URI, then read it as bytes.
      const asset = Asset.fromModule(receiptModule);
      await asset.downloadAsync();
      const uri = asset.localUri ?? asset.uri;
      const buffer = await (await fetch(uri)).arrayBuffer();

      const start = Date.now();
      const ocr = await service.recognize(buffer, { flatten: true });
      const ms = Date.now() - start;

      setResult({ text: ocr.text, confidence: ocr.confidence, ms });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  return { status, result, error, runOcr };
}
