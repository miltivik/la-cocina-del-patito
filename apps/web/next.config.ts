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
		// Solo aplicar rewrites en desarrollo
		if (process.env.NODE_ENV === 'development') {
			return [
				{
					source: '/api/:path*',
					destination: 'http://localhost:3001/api/:path*', // Puerto del servidor backend
				},
			];
		}
		// En producción, no hacer rewrites - dejar que el cliente llame directamente al backend
		return [];
	},
};

export default nextConfig;
