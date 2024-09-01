/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["globotix-be.singaporetestlab.com"],
	},
	experimental: {
		forceSwcTransforms: true,
	},
};

export default nextConfig;
