import type { Metadata, Viewport } from "next";
import "./global.css";
import Layout from "@/components/Layout";
import Providers from "./providers";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
	metadataBase: new URL("https://sexistential.xyz"),
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.title}`,
	},
	openGraph: {
		type: "website",
		title: siteConfig.title,
		description: siteConfig.description,
		url: "https://sexistential.xyz",
		siteName: siteConfig.title,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.title,
			},
		],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	description: siteConfig.description,
	keywords: siteConfig.keywords,
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`motion-safe:scroll-smooth`}>
			<body>
				<Providers>
					<Layout>
						<div id="root">{children}</div>
					</Layout>
				</Providers>
			</body>
		</html>
	);
}
