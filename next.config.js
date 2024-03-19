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
    output: 'export',
    // for react-pdf
    // webpack: (config) => {
    //     config.resolve.alias.canvas = false;
    //
    //     return config;
    // },
};

module.exports = nextConfig;
