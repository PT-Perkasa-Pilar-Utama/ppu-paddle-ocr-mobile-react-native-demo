// Default Expo Metro config. Standalone app — dependencies resolve from npm.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;
