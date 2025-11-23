import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ["shiki"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:3000/api/:path*',
			},
		];
	},
};

export default nextConfig;
