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

  webpack: (config) => {
    // Solución para react-quill
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  }
};

module.exports = nextConfig;