/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // Enable standalone output for Docker deployments
  output: 'standalone',
  
  // TODO: uncomment this when is't stable
  // experimental: {
  //   dynamicIO: true,
  // },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable SWC minification
  swcMinify: true,
};

export default config;
