const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo so all hoisted and local dependencies are monitored
config.watchFolders = [monorepoRoot];

// 2. Resolve local workspace packages first, then hoisted monorepo node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Pin single unified React, React DOM, and React Native paths across workspaces
const reactDir = path.dirname(
  require.resolve("react/package.json", { paths: [projectRoot, monorepoRoot] })
);
const reactDomDir = path.dirname(
  require.resolve("react-dom/package.json", { paths: [projectRoot, monorepoRoot] })
);
const reactNativeDir = path.dirname(
  require.resolve("react-native/package.json", { paths: [projectRoot, monorepoRoot] })
);

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
