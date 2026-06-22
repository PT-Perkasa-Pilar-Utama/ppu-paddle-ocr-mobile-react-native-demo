import React from "react";
import { Image, StyleSheet, View } from "react-native";

const receiptModule = require("../../assets/receipt.jpg");

export function ReceiptPreview(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Image source={receiptModule} style={styles.image} resizeMode="contain" />
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
});
