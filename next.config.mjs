/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"],
        remotePatterns: [
            {
                hostname: "res.cloudinary.com",
                pathname: "/dgxfuzqed/image/",
                port: "443",
            },
            {
                hostname: "localhost",
                port: "3000",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
