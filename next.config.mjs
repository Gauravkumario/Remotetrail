/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Netlify
  // output: "export",

  // Environment specific settings
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // Image optimization settings
  images: {
    // unoptimized: true, // Not needed for dynamic deployment
  },
};

export default nextConfig;
