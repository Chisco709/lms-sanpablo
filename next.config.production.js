/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // ✅ CONFIGURACIÓN SEGURA PARA PRODUCCIÓN
  typescript: {
    // NO ignorar errores en producción - forzar código limpio
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Verificar ESLint en build - código de calidad
    ignoreDuringBuilds: false,
  },
  
  // ✅ Configuración de imágenes optimizada
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
      },
      {
        protocol: "https",
        hostname: "vercel.app",
        pathname: "/**",
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // 1 hora de cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ Headers de seguridad para producción
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },

  // ✅ Optimizaciones de rendimiento
  poweredByHeader: false,
  compress: true,
  
  // ✅ Configuración para subida de archivos
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '8mb',
  },

  // ✅ Configuraciones experimentales estables
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@heroicons/react',
      'framer-motion'
    ],
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // ✅ Optimizaciones de Webpack para producción
  webpack: (config, { dev, isServer }) => {
    // Solo en producción
    if (!dev) {
      // Configuración de chunks optimizada
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
          },
        },
      };

      // Optimizar imports
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, './'),
      };
    }

    // Configuración para Prisma
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      });
    }

    return config;
  },

  // ✅ Configuración de output para Vercel
  output: 'standalone',
  
  // ✅ Redirects para rutas de administración
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/teacher',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/',
        permanent: false,
      },
    ];
  },

  // ✅ Configuración de reescritura para APIs
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health/route',
      },
    ];
  },

  // ✅ Variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
};

module.exports = nextConfig; 