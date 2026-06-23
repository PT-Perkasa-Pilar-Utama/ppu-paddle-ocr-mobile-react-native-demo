import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  uri: string | null;
  label: string | null;
};

export function ImagePreview({ uri, label }: Props): React.JSX.Element {
  return (
    <View style={styles.card}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 8,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0f19",
  },
  placeholderText: {
    color: "#475569",
    fontSize: 13,
  },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 6,
  },
});
