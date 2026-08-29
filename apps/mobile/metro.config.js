const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch packages and root node_modules
config.watchFolders = [
  path.resolve(monorepoRoot, "packages/shared"),
  path.resolve(monorepoRoot, "node_modules"),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Single unified React & core instances
const reactDir = path.resolve(projectRoot, "node_modules/react");
const reactDomDir = path.resolve(projectRoot, "node_modules/react-dom");
const reactNativeDir = path.resolve(projectRoot, "node_modules/react-native");

config.resolver.extraNodeModules = {
  react: reactDir,
  "react-dom": reactDomDir,
  "react-native": reactNativeDir,
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react") {
    return {
      filePath: path.resolve(reactDir, "index.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-runtime") {
    return {
      filePath: path.resolve(reactDir, "jsx-runtime.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-dev-runtime") {
    return {
      filePath: path.resolve(reactDir, "jsx-dev-runtime.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react-dom") {
    return {
      filePath: path.resolve(reactDomDir, "index.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react-native") {
    return {
      filePath: path.resolve(reactNativeDir, "index.js"),
      type: "sourceFile",
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
  input: path.resolve(projectRoot, "global.css"),
  configPath: path.resolve(projectRoot, "tailwind.config.js"),
});
