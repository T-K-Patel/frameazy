/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // NOTE : Update this in production.
        domains: ["loremflickr.com", "localhost"],
        remotePatterns: [
            {
                hostname: "loremflickr.com",
                port: "443",
            },
            {
                hostname: "localhost",
                port: "3000",
            },
        ],
    },
};

export default nextConfig;
