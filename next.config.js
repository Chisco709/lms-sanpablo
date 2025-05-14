/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: [
      "utfs.io",
      "localhost"
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      }
    ]
  },

  /* config options here */
  webpack: (config) => {
    // Esto ayuda a resolver problemas con la importación de módulos usando @/
    return config;
  }
};

module.exports = nextConfig; 