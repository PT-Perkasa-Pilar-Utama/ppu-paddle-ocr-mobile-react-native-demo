import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { ModelChoice } from "../ocr/presets";

type Props = {
  models: ModelChoice[];
  activeKey: string;
  disabled?: boolean;
  onSelect: (key: string) => void;
};

export function ModelPicker({
  models,
  activeKey,
  disabled,
  onSelect,
}: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Model preset</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {models.map((m) => {
          const selected = m.key === activeKey;
          return (
            <Pressable
              key={m.key}
              style={[styles.chip, selected && styles.chipActive, disabled && styles.disabled]}
              onPress={() => onSelect(m.key)}
              disabled={disabled}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelActive]}>{m.label}</Text>
              <Text style={[styles.chipNote, selected && styles.chipNoteActive]}>{m.note}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  heading: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  row: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  chipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  disabled: {
    opacity: 0.5,
  },
  chipLabel: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700",
  },
  chipLabelActive: {
    color: "#0b0f19",
  },
  chipNote: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 2,
  },
  chipNoteActive: {
    color: "#0b0f19",
  },
});
