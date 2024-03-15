/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
        exclude: ["node_modules", ".next"],
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true
    },
    output: 'export'
};

module.exports = nextConfig;
