/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Add this
  matcher: ["/admin/:path*"],
};

export default nextConfig;
