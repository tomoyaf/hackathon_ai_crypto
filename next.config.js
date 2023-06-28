const { withKumaUI } = require("@kuma-ui/next-plugin");
const withInterceptStdout = require("next-intercept-stdout");

/** @type {import('next').NextConfig} */
let nextConfig = {};
nextConfig = withInterceptStdout(nextConfig, (text) =>
  text.includes("Duplicate atom key") ? "" : text
);

module.exports = withKumaUI(nextConfig);
