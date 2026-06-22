import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { OcrResult } from "../hooks/useOcr";

type Props = {
  result: OcrResult | null;
};

export function ResultCard({ result }: Props): React.JSX.Element | null {
  if (!result) return null;

  return (
    <View style={styles.card}>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>Confidence: {(result.confidence * 100).toFixed(1)}%</Text>
        <Text style={styles.stat}>{result.ms} ms</Text>
      </View>
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
