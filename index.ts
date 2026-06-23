import { registerRootComponent } from "expo";

import App from "./App";
import { installConsoleCapture } from "./src/logging/logStore";

// Mirror console output (incl. the OCR pipeline's verbose logs) into the
// in-app Process log panel. Installed before render so model init is captured.
installConsoleCapture();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in a dev client or a native
// build, the environment is set up appropriately.
registerRootComponent(App);
