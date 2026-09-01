/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    reactCompiler: false,

    experimental: {
        optimizeCss: true,
    },

    compiler: {
        emotion: true,
    },

    images: {
        unoptimized: false,
    },

    typescript: {
        ignoreBuildErrors: false,
    },
};

module.exports = nextConfig;