import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";

const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	/* config options here */
	output: "export",
	images: {
		unoptimized: true,
	},
	assetPrefix: isProd ? undefined : `http://${internalHost}:3456`,
	devIndicators: {
		appIsrStatus: false,
	},
	reactStrictMode: false,
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"],
	},
};

export default withNextIntl(nextConfig);
