import React, { useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { clearLogs, useLogs, type LogLevel } from "../logging/logStore";

const LEVEL_COLOR: Record<LogLevel, string> = {
  info: "#93c5fd",
  warn: "#fbbf24",
  error: "#f87171",
};

function timestamp(at: number): string {
  const d = new Date(at);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function LogPanel(): React.JSX.Element {
  const logs = useLogs();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, [logs]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Process log</Text>
        <Pressable onPress={clearLogs} hitSlop={8}>
          <Text style={styles.clear}>Clear</Text>
        </Pressable>
      </View>
      <ScrollView
        ref={scrollRef}
        style={styles.body}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {logs.length === 0 ? (
          <Text style={styles.empty}>Waiting for activity…</Text>
        ) : (
          logs.map((line) => (
            <Text key={line.id} style={styles.line}>
              <Text style={styles.ts}>{timestamp(line.at)} </Text>
              <Text style={{ color: LEVEL_COLOR[line.level] }}>{line.msg}</Text>
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0a0f1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    padding: 12,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clear: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "600",
  },
  body: {
    maxHeight: 180,
  },
  empty: {
    color: "#475569",
    fontSize: 12,
    fontFamily: "Courier",
  },
  line: {
    fontSize: 11,
    fontFamily: "Courier",
    lineHeight: 16,
  },
  ts: {
    color: "#475569",
  },
});
