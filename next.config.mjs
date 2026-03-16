/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint runs separately in CI; skip during `next build`
    ignoreDuringBuilds: true,
  },
  staticPageGenerationTimeout: 120,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
