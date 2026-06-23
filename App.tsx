import React, { useCallback } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useOcr } from "./src/hooks/useOcr";
import { useImageSource } from "./src/hooks/useImageSource";
import { Header } from "./src/components/Header";
import { ImagePreview } from "./src/components/ImagePreview";
import { SourcePicker } from "./src/components/SourcePicker";
import { ModelPicker } from "./src/components/ModelPicker";
import { ResultCard } from "./src/components/ResultCard";
import { LogPanel } from "./src/components/LogPanel";

const STATUS_LABEL: Record<string, string> = {
  initializing: "Loading model…",
  ready: "Ready",
  running: "Recognizing…",
  done: "Done",
  error: "Error",
};

export default function App(): React.JSX.Element {
  const { status, result, error, modelKey, models, selectModel, recognize } = useOcr();
  const { image, pickReceipt, pickFromLibrary, pickFromCamera, loadBuffer } = useImageSource();

  const busy = status === "initializing" || status === "running";

  const runOcr = useCallback(async () => {
    if (busy || !image) return;
    const buffer = await loadBuffer();
    await recognize(buffer);
  }, [busy, image, loadBuffer, recognize]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Header />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ImagePreview uri={image?.uri ?? null} label={image?.label ?? null} />

          <SourcePicker
            active={image?.kind ?? null}
            disabled={busy}
            onReceipt={pickReceipt}
            onLibrary={pickFromLibrary}
            onCamera={pickFromCamera}
          />

          <ModelPicker
            models={models}
            activeKey={modelKey}
            disabled={busy}
            onSelect={selectModel}
          />

          <Pressable
            style={[styles.button, (busy || !image) && styles.buttonDisabled]}
            onPress={runOcr}
            disabled={busy || !image}
          >
            {busy ? (
              <ActivityIndicator color="#0b0f19" />
            ) : (
              <Text style={styles.buttonText}>Run OCR</Text>
            )}
          </Pressable>

          <Text style={styles.status}>Status: {STATUS_LABEL[status] ?? status}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <ResultCard result={result} />

          <LogPanel />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f19",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#38bdf8",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#0b0f19",
    fontSize: 16,
    fontWeight: "700",
  },
  status: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
  error: {
    color: "#f87171",
    fontSize: 13,
    marginTop: 12,
  },
});
