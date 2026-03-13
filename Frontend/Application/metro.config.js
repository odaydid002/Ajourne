const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer");

// keep svg out of asset list so we can use the transformer
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

// add wasm to asset extensions so imports like './wa-sqlite.wasm' resolve
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

// treat .wasm as a source extension too (helps web bundler resolve ESM imports)
if (!config.resolver.sourceExts.includes("wasm")) {
  config.resolver.sourceExts.push("wasm");
}

// include web platform so metro can bundle for web properly
if (!config.resolver.platforms.includes('web')) {
  config.resolver.platforms.push('web');
}
 
module.exports = withNativeWind(config, { input: './app/global.css' })