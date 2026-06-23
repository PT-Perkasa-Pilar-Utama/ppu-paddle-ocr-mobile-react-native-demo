import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useOcr } from "./src/hooks/useOcr";
import { Header } from "./src/components/Header";
import { ReceiptPreview } from "./src/components/ReceiptPreview";
import { ResultCard } from "./src/components/ResultCard";

const STATUS_LABEL: Record<string, string> = {
  initializing: "Downloading models…",
  ready: "Ready",
  running: "Recognizing…",
  done: "Done",
  error: "Error",
};

export default function App(): React.JSX.Element {
  const { status, result, error, runOcr } = useOcr();

  const busy = status === "initializing" || status === "running";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Header />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ReceiptPreview />

          <Pressable
            style={[styles.button, busy && styles.buttonDisabled]}
            onPress={runOcr}
            disabled={busy}
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
