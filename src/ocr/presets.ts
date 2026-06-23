import {
  V6_SMALL_MODEL,
  V6_MEDIUM_MODEL,
  V6_TINY_MODEL,
  V5_EN_MOBILE_MODEL,
  V5_EN_MOBILE_INT8_MODEL,
  type ModelUrls,
} from "ppu-paddle-ocr/mobile";

export type ModelChoice = {
  key: string;
  label: string;
  note: string;
  model: ModelUrls;
};

/**
 * A curated subset of the built-in catalogue, enough to show the
 * accuracy/speed/size trade-off without listing all 24 presets. The first
 * entry is the library default (PP-OCRv6 small).
 */
export const MODEL_CHOICES: ModelChoice[] = [
  { key: "v6-small", label: "v6 small", note: "Default · balanced", model: V6_SMALL_MODEL },
  { key: "v6-tiny", label: "v6 tiny", note: "Fastest · smaller dict", model: V6_TINY_MODEL },
  { key: "v6-medium", label: "v6 medium", note: "Most accurate · slowest", model: V6_MEDIUM_MODEL },
  { key: "v5-en-mobile", label: "v5 EN", note: "English mobile", model: V5_EN_MOBILE_MODEL },
  { key: "v5-en-int8", label: "v5 EN int8", note: "Quantized · x86/WASM", model: V5_EN_MOBILE_INT8_MODEL },
];

export const DEFAULT_MODEL_CHOICE = MODEL_CHOICES[0];
