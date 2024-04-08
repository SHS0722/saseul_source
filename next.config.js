const { PHASE_DEVELOPMENT_SERVER } = require('next/dist/shared/lib/constants');
const fetch = require('node-fetch')
const net = require('net')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: "nextjs-node-loader",
          options: {
            outputPath: config.output.path
          }
        },
      ],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/',
      },
    ];
  },
};

async function getPublicIp() {
  const res = await fetch('https://api64.ipify.org')
  const ip = await res.text()
  if (net.isIP(ip)) {
    return ip
  } else {
    return undefined
  }
}

module.exports = async (phase, { defaultConfig }) => {
  return nextConfig
}
