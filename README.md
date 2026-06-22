# ppu-paddle-ocr — React Native demo

A minimal [Expo](https://expo.dev) app that runs the `ppu-paddle-ocr/mobile` OCR
pipeline on-device (iOS / Android). It loads a bundled receipt, recognizes the
text with PP-OCRv6, and shows the result, confidence, and timing.

## Requirements

`ppu-paddle-ocr/mobile` and its dependencies ship native modules, so this needs a
**dev client or a prebuilt native project — Expo Go will not work**.

- Node ≥ 18 and a package manager (npm / bun / yarn)
- Xcode (iOS) and/or Android Studio (Android)
- React Native ≥ 0.74 / Expo SDK ≥ 51 (Hermes)

## Run

```bash
cd ppu-paddle-ocr-mobile-react-native-demo
npm install

# Generate the native projects (required — pulls in the native modules)
npx expo prebuild

# Build & launch on a simulator/emulator or device
npm run ios        # or: npm run android
```

The first OCR run downloads the PP-OCRv6 small models (~30 MB) over the network
and caches them in memory for the session.

## How it works

```ts
import { PaddleOcrService } from "ppu-paddle-ocr/mobile";

const service = new PaddleOcrService();
await service.initialize();

const result = await service.recognize(imageBuffer, { flatten: true });
console.log(result.text, result.confidence);

await service.destroy();
```

- `src/hooks/useOcr.ts` — owns the service lifecycle (init on mount, recognize on
  demand) and reads the bundled asset as an `ArrayBuffer`.
- `App.tsx` — wires the preview, the Run button, and the result card.

To OCR a live capture instead of the bundled image, pass a frame from
[`expo-camera`](https://docs.expo.dev/versions/latest/sdk/camera/) or
[`react-native-vision-camera`](https://github.com/mrousavy/react-native-vision-camera)
as an `ArrayBuffer` to `recognize()`.

## Notes

- **CPU by default.** Pass `new PaddleOcrService({ session: { executionProviders: ["nnapi"] } })`
  on Android or `["coreml"]` on iOS to opt into hardware acceleration.
- **Smaller download.** Pass a lighter preset, e.g.
  `new PaddleOcrService({ model: V5_EN_MOBILE_INT8_MODEL })`, if app-start latency
  matters more than multilingual coverage.

## Developing against a local build

This demo depends on the published `ppu-paddle-ocr@^6.0.0`. To test an unpublished
local change, clone the [ppu-paddle-ocr](https://github.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr)
repo, build it, and install the packed tarball into this demo:

```bash
# in your ppu-paddle-ocr checkout
bun run build
cd lib && npm pack          # produces ppu-paddle-ocr-<version>.tgz

# back in this demo
npm install /absolute/path/to/ppu-paddle-ocr-<version>.tgz
```
