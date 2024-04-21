import createJiti from 'jiti';
import { fileURLToPath } from 'node:url';
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/env.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;
