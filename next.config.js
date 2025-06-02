/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // PWA y optimizaciones de headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection', 
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        // Corrige la regex: elimina grupos de captura
        source: '/:all*.(jpg|jpeg|png|gif|webp|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

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
        pathname: "/**",
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },

  // Optimizaciones para producción
  poweredByHeader: false,
  compress: true,
  
  // Configuración para build estable
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Optimizaciones experimentales avanzadas
  experimental: {
    optimizeCss: true,
    esmExternals: true,
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'lucide-react',
      'framer-motion'
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
    serverExternalPackages: ['@prisma/client'], // Actualizado: antes serverComponentsExternalPackages
    optimizeServerReact: true,
  },

  // Configuración específica para Vercel
  ...(process.env.VERCEL && {
    experimental: {
      ...nextConfig.experimental,
      optimizeCss: false, // Desactivar en Vercel si causa problemas
    }
  }),

  // Bundle analyzer solo en desarrollo
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    }
  }),

  // Optimizaciones de webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimización de chunks
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
    }

    // Optimización para librerías grandes
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }

    // Optimizar bundle size
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // Redirects para SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/student',
        permanent: false,
      },
      {
        source: '/cursos',
        destination: '/search',
        permanent: true,
      }
    ]
  },

  // Rewrites para URLs amigables
  async rewrites() {
    return [
      {
        source: '/curso/:slug',
        destination: '/courses/:slug',
      },
      {
        source: '/categoria/:category',
        destination: '/search?categoryId=:category',
      }
    ]
  },

  // Variables de entorno para optimización
  env: {
    CUSTOM_KEY: 'instituto-san-pablo-lms',
    NEXT_TELEMETRY_DISABLED: '1',
  },

  // Configuración de salida optimizada
  output: 'standalone',
  trailingSlash: false,
  
  // Logging para debugging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

module.exports = nextConfig;