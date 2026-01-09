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

    env: {
        WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
        WORDPRESS_API_BASE: process.env.NEXT_PUBLIC_WORDPRESS_API_BASE,
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
}

module.exports = nextConfig;