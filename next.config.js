/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
