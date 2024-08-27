/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you want to add specific redirects or rewrites, you can include them here
  async redirects() {
    return [
      {
        source: "/",
        destination: "/", // This will be handled by Astro, so no actual redirect needed
        permanent: true,
      },
    ];
  },
  // Add any other custom Next.js configurations here
};

export default nextConfig;
