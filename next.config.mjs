import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@splinetool/react-spline/next": path.resolve(
        __dirname,
        "node_modules/@splinetool/react-spline/dist/react-spline-next.js"
      ),
      "@splinetool/react-spline": path.resolve(
        __dirname,
        "node_modules/@splinetool/react-spline/dist/react-spline.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
