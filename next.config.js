/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dxlnfef9j.cloudinary.com',
                port: '',
                pathname: '/**',
            }
        ]
    }
};

module.exports = nextConfig;
