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
		"Robyn returns with her first new music in over seven years. New single 'Dopamine' sees the generational Swedish pop icon teaming up with longtime collaborator Klas Åhlund for one of the decade's most hotly-anticipated comebacks, and the latest in a long line of era-defining pop moments.",
	url: siteUrl,
	ogImage: `${siteUrl}/opengraph-image.jpg`,
	keywords: ["sexistential", "dopamine", "robyn", "pop music"],
};
