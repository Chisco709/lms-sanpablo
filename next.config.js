/** @type {import('next').NextConfig} */
const nextConfig = {
  
 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
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