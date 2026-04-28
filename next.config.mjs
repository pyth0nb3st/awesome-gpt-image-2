import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

const assetBaseUrl = process.env.NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL;
const assetRemotePattern = (() => {
  if (!assetBaseUrl) return [];
  try {
    const url = new URL(assetBaseUrl);
    return [
      {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: {
    root,
  },
  images: {
    unoptimized: true,
    remotePatterns: assetRemotePattern,
  },
};

export default nextConfig;
