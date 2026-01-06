/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Для React 19 оптимизации
    experimental: {
        reactCompiler: false, // ← Пока отключите если используете
        optimizeCss: true,
        turbo: {
            resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
        }
    },

    // Для MUI и Emotion
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
    }
}

module.exports = nextConfig