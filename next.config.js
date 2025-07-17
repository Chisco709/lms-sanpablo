/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CONFIGURACIÓN DE PRODUCCIÓN SEGURA
  typescript: {
    // Solo permitir build si no hay errores críticos
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Verificar ESLint en build
    ignoreDuringBuilds: false,
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
    minimumCacheTTL: 3600, // 1 hora cache
  },

  // Optimizaciones de producción
  poweredByHeader: false,
  compress: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Optimizaciones experimentales estables
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Configuración de Webpack para producción
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Optimizaciones para producción
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;