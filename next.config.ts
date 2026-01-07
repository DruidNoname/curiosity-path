// @type {import('next').NextConfig}

const nextConfig = {
    reactStrictMode: true,

    experimental: {
        reactCompiler: false,
        optimizeCss: false,
        turbo: {
            resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
        }
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

    eslint: {
        ignoreDuringBuilds: false,
    },

    env: {
        WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
        WORDPRESS_API_BASE: process.env.NEXT_PUBLIC_WORDPRESS_API_BASE,
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },

    publicRuntimeConfig: {
        WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL ||
            (process.env.NODE_ENV === 'production'
                ? 'http://suffer.curiosity-path.ru'
                : 'http://localhost:8888'),

        WORDPRESS_API_BASE: process.env.NEXT_PUBLIC_WORDPRESS_API_BASE ||
            (process.env.NODE_ENV === 'production'
                ? 'http://suffer.curiosity-path.ru/wp-json/wp/v2'
                : 'http://localhost:8888/wp-json/wp/v2'),

        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ||
            (process.env.NODE_ENV === 'production'
                ? 'https://curiosity-path.ru'
                : 'http://localhost:3000'),
    }
}

module.exports = nextConfig