import { useCallback, useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as ImagePicker from "expo-image-picker";

import { pushLog } from "../logging/logStore";

const receiptModule = require("../../assets/receipt.jpg");

export type SourceKind = "receipt" | "library" | "camera";

export type SelectedImage = {
  kind: SourceKind;
  uri: string;
  label: string;
};

export type UseImageSource = {
  image: SelectedImage | null;
  pickReceipt: () => Promise<void>;
  pickFromLibrary: () => Promise<void>;
  pickFromCamera: () => Promise<void>;
  /** Reads the currently selected image as raw bytes for recognition. */
  loadBuffer: () => Promise<ArrayBuffer>;
};

async function resolveReceiptUri(): Promise<string> {
  const asset = Asset.fromModule(receiptModule);
  await asset.downloadAsync();
  return asset.localUri ?? asset.uri;
}

export function useImageSource(): UseImageSource {
  const [image, setImage] = useState<SelectedImage | null>(null);

  const pickReceipt = useCallback(async () => {
    const uri = await resolveReceiptUri();
    setImage({ kind: "receipt", uri, label: "Bundled receipt" });
    pushLog("info", "[source] using bundled receipt");
  }, []);

  // Default to the bundled receipt on mount.
  useEffect(() => {
    void pickReceipt();
  }, [pickReceipt]);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      pushLog("warn", "[source] photo library permission denied");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (res.canceled) {
      pushLog("info", "[source] library pick canceled");
      return;
    }
    const asset = res.assets[0];
    setImage({ kind: "library", uri: asset.uri, label: asset.fileName ?? "Library image" });
    pushLog("info", `[source] picked from library (${asset.width}x${asset.height})`);
  }, []);

  const pickFromCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      pushLog("warn", "[source] camera permission denied");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (res.canceled) {
      pushLog("info", "[source] camera capture canceled");
      return;
    }
    const asset = res.assets[0];
    setImage({ kind: "camera", uri: asset.uri, label: "Camera capture" });
    pushLog("info", `[source] captured from camera (${asset.width}x${asset.height})`);
  }, []);

  const loadBuffer = useCallback(async (): Promise<ArrayBuffer> => {
    if (!image) throw new Error("No image selected");
    return (await fetch(image.uri)).arrayBuffer();
  }, [image]);

  return { image, pickReceipt, pickFromLibrary, pickFromCamera, loadBuffer };
}
