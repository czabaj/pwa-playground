const withPWA = require(`next-pwa`);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

//module.exports = nextConfig;

module.exports = withPWA({ ...nextConfig, pwa: { dest: `public` } });
