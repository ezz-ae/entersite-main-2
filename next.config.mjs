
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

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
    async rewrites() {
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
        const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${rootDomain}`;
        const normalizedSiteDomain = siteDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        const hostPattern = `(?<subdomain>[^.]+)\\.${normalizedSiteDomain.replace(/\./g, '\\.')}`;

        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: hostPattern }],
                destination: '/p/:subdomain',
            },
        ];
    },
};

export default nextConfig;
