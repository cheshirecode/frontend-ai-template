import type { NextConfig } from "next";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

// Get git commit hash at build time (graceful fallback for non-git repos)
const getGitCommitHash = (): string => {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return 'development';
  }
};

// Get package version from package.json
const getPackageVersion = (): string => {
  try {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    return packageJson.version;
  } catch {
    return '1.0.0';
  }
};

const nextConfig: NextConfig = {
  env: {
    GIT_COMMIT_SHA: getGitCommitHash(),
    PACKAGE_VERSION: getPackageVersion(),
    BUILD_TIME: new Date().toISOString(),
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
