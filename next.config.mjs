/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude chrome-aws-lambda from server bundle
      config.externals.push('chrome-aws-lambda');
    }
    return config;
  },
};

export default nextConfig;
