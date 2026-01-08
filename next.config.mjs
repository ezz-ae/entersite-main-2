
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        // Resolve Firebase modules to their browser-specific versions for client-side
        if (!isServer) {
            config.resolve.alias['firebase/app'] = require.resolve('firebase/app');
            config.resolve.alias['firebase/auth'] = require.resolve('firebase/auth');
            config.resolve.alias['firebase/firestore'] = require.resolve('firebase/firestore');
        }
        return config;
    },
    turbopack: {
        // Force Next.js to treat this folder as the workspace root so .env.local is loaded here.
        root: __dirname,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '4.5mb',
        },
    },
};

export default nextConfig;
