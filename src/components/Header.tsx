import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function Header(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ppu-paddle-ocr</Text>
      <Text style={styles.subtitle}>On-device OCR via React Native + Skia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 2,
  },
});
