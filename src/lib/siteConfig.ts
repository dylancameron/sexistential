type SiteConfig = {
	title: string;
	description: string;
	url: string;
	ogImage: string;
	keywords: string[];
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sexistential.xyz";

export const siteConfig: SiteConfig = {
	title: "sexistential.xyz",
	description:
		"",
	url: siteUrl,
	ogImage: `${siteUrl}/opengraph-image`,
	keywords: [
		"",
		""
	]
}