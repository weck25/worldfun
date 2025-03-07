import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['gateway.pinata.cloud'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'violet-able-landfowl-471.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cyan-effective-fly-860.mypinata.cloud',
      },
      {
        hostname: 'ipfs.fleek.co'
      },
      {
        hostname: 'img.freepik.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        hostname: 'api.bluepill.fun'
      }
    ]
  },
};

export default nextConfig;
