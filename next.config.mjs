/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "res.cloudinary.com",
                pathname: "/dgxfuzqed/image/",
                port: "443",
            },
        ],
    },
};

export default nextConfig;
