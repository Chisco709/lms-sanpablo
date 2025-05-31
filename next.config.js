/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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
    ]
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

  // Optimizaciones experimentales estables
  experimental: {
    optimizeCss: true,
    esmExternals: true,
  },

  // Configuración específica para Vercel
  ...(process.env.VERCEL && {
    experimental: {
      optimizeCss: false, // Desactivar en Vercel si causa problemas
    }
  }),

  // Bundle analyzer solo en desarrollo
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    }
  }),
};

module.exports = nextConfig;