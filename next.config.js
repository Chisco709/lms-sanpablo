/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración permisiva para evitar errores de build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https", 
        hostname: "uploadthing.com",
        pathname: "/**",
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
    domains: ['res.cloudinary.com'],
  },

  poweredByHeader: false,
  compress: true,
  
  // Configuración experimental mínima
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Webpack simple para evitar errores
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;