const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Add a custom string replacer hook to kill the OTEL_PKG dynamic import
config.transformer.minifierPath = "metro-minify-terser";
config.transformer.minifierConfig = {
  compress: {
    // This tells the minifier to drop dead code or drop specific expressions
    global_defs: {
      OTEL_PKG: "null",
    },
  },
};

module.exports = config;
