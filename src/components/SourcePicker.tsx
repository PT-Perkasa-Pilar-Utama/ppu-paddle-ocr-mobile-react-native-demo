import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { SourceKind } from "../hooks/useImageSource";

type Props = {
  active: SourceKind | null;
  disabled?: boolean;
  onReceipt: () => void;
  onLibrary: () => void;
  onCamera: () => void;
};

const OPTIONS: { kind: SourceKind; label: string }[] = [
  { kind: "receipt", label: "Receipt" },
  { kind: "library", label: "Library" },
  { kind: "camera", label: "Camera" },
];

export function SourcePicker({
  active,
  disabled,
  onReceipt,
  onLibrary,
  onCamera,
}: Props): React.JSX.Element {
  const handlers: Record<SourceKind, () => void> = {
    receipt: onReceipt,
    library: onLibrary,
    camera: onCamera,
  };

  return (
    <View>
      <Text style={styles.heading}>Image source</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const selected = active === opt.kind;
          return (
            <Pressable
              key={opt.kind}
              style={[styles.segment, selected && styles.segmentActive, disabled && styles.disabled]}
              onPress={handlers[opt.kind]}
              disabled={disabled}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  segmentActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  disabled: {
    opacity: 0.5,
  },
  segmentText: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#0b0f19",
  },
});
