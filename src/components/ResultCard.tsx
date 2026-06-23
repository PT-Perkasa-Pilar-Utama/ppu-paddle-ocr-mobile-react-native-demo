import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";

import type { OcrResult } from "../hooks/useOcr";

type Props = {
  result: OcrResult | null;
};

function toJson(result: OcrResult): string {
  return JSON.stringify(
    {
      model: result.model,
      durationMs: result.ms,
      confidence: result.confidence,
      text: result.text,
      items: result.items,
    },
    null,
    2,
  );
}

export function ResultCard({ result }: Props): React.JSX.Element | null {
  const [copied, setCopied] = useState(false);

  const copyJson = useCallback(async () => {
    if (!result) return;
    await Clipboard.setStringAsync(toJson(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  if (!result) return null;

  return (
    <View style={styles.card}>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>Confidence: {(result.confidence * 100).toFixed(1)}%</Text>
        <Text style={styles.stat}>{result.ms} ms</Text>
      </View>

      <Pressable style={styles.copyButton} onPress={copyJson}>
        <Text style={styles.copyText}>{copied ? "Copied!" : "Copy JSON"}</Text>
      </Pressable>

      <ScrollView style={styles.textBox} nestedScrollEnabled>
        <Text style={styles.text}>{result.text || "(no text detected)"}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stat: {
    color: "#38bdf8",
    fontSize: 13,
    fontWeight: "600",
  },
  copyButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  copyText: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "700",
  },
  textBox: {
    maxHeight: 200,
  },
  text: {
    color: "#e2e8f0",
    fontSize: 14,
    fontFamily: "Courier",
    lineHeight: 20,
  },
});
