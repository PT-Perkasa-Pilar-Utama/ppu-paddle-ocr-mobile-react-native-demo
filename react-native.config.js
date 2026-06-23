const path = require("path");

// onnxruntime-react-native ships a legacy `unimodule.json`, which makes
// expo-modules-autolinking treat it as an Expo module and skip it during RN
// community autolinking — while modern Expo autolinking ignores it (it wants
// `expo-module.config.json`). The package therefore never gets linked, leaving
// `NativeModules.Onnxruntime` null and `Module.install()` throwing at startup.
// Declaring it explicitly forces autolinking to wire settings.gradle +
// app/build.gradle + the generated PackageList.
const ortRoot = path.dirname(
  require.resolve("onnxruntime-react-native/package.json")
);

module.exports = {
  dependencies: {
    "onnxruntime-react-native": {
      root: ortRoot,
      platforms: {
        android: {
          sourceDir: path.join(ortRoot, "android"),
          packageImportPath: "import ai.onnxruntime.reactnative.OnnxruntimePackage;",
          packageInstance: "new OnnxruntimePackage()",
        },
      },
    },
  },
};
