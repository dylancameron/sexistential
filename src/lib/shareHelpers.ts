import { toast } from "sonner";
import uploadToVercelBlob from "./uploadToBlob";
import fetchFile from "./fetchFile";
import * as htmlToImage from "html-to-image";

export const captureVennDiagram = async (element: HTMLElement) => {
	if (!element) return null;

	try {
		const blob = await htmlToImage.toBlob(element, { quality: 1 });
		return blob;
	} catch (error) {
		console.error("Failed to capture Venn diagram:", error);
		return null;
	}
};

export const handleDownload = async (
	imageUrl: string,
	setLoading: (loading: boolean) => void
) => {
	if (!imageUrl) return;

	setLoading(true);

	try {
		const file = await fetchFile(imageUrl, "sexistential.jpg");
		const url = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = url;
		link.download = "sexistential.jpg";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch {
		toast.error("Failed to download image");
	}
	setLoading(false);
};

export const handleShare = async (
	imageUrl: string,
	setLoading: (loading: boolean) => void,
	setCopyPopoverOpen: (copyPopoverOpen: boolean) => void
) => {
	if (!imageUrl) {
		toast.error("Fill out all intersections first");
		return;
	}

	setLoading(true);

	try {
		const file = await fetchFile(imageUrl, "sexistential.jpg");
		if (
			navigator.share &&
			navigator.canShare &&
			navigator.canShare({ files: [file] })
		) {
			await navigator.share({
				files: [file],
				title: "https://sexistential.xyz",
			});
		} else {
			const blobUrl = await uploadToVercelBlob(file);
			if (navigator.share) {
				await navigator.share({
					url: blobUrl,
					title: "https://sexistential.xyz",
				});
			} else {
				await navigator.clipboard.writeText(blobUrl);
				setCopyPopoverOpen(true);
				toast.success("Copied to clipboard");
				setTimeout(() => setCopyPopoverOpen(false), 2000);
			}
		}
	} catch (error) {
		// Always show error unless it's an AbortError that you want to ignore.
		if (!(error instanceof DOMException && error.name === "AbortError")) {
			toast.error("Sharing failed. Try saving the image manually.");
		}
	} finally {
		setLoading(false);
	}
};

export const handleSocialShare = async (
	platform: "facebook" | "instagram" | "copy",
	setLoading: (loading: boolean) => void,
	imageUrl: string,
	setCopyPopoverOpen: (popoverOpen: boolean) => void
) => {
	if (!imageUrl) {
		toast.error("Empty");
		return;
	}
	setLoading(true);

	try {
		const response = await fetch(imageUrl);
		const imageBlob = await response.blob();

		if (!imageBlob) {
			throw new Error("Failed to capture image");
		}

		const imageBlobUrl = await uploadToVercelBlob(imageBlob);
		if (!imageBlobUrl) {
			throw new Error("Failed to upload image");
		}

		if (platform === "facebook") {
			if (navigator.share) {
				const file = new File([imageBlob], "sexistential.jpg", {
					type: "image/jpeg",
				});
				try {
					await navigator.share({
						files: [file],
						title: "https://sexistential.xyz",
					});
				} catch (error) {
					if (
						!(
							error instanceof DOMException &&
							error.name === "AbortError"
						)
					) {
						toast.error("Failed to share to Facebook");
					}
				}
			} else {
				const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					imageBlobUrl
				)}`;
				window.open(shareUrl, "_blank");
			}
		} else if (platform === "instagram") {
			if (navigator.share) {
				const file = new File([imageBlob], "sexistential.xyz", {
					type: "iimage/jpeg",
				});
				try {
					await navigator.share({
						files: [file],
						title: "https://sexistential.xyz",
					});
				} catch (error) {
					// If user cancels, ignore it
					if (
						!(
							error instanceof DOMException &&
							error.name === "AbortError"
						)
					) {
						toast.error("Failed to share to Instagram");
					}
				}
			} else {
				// Fallback for devices without navigator.share
				const link = document.createElement("a");
				link.href = URL.createObjectURL(imageBlob);
				link.download = "sexistential.xyz";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				toast.info(
					"Image downloaded. You can now share image file to Instagram manually."
				);
			}
		} else if (platform === "copy") {
			if (navigator.share) {
				const file = new File([imageBlob], "sexistential.xyz", {
					type: "image/jpeg",
				});
				try {
					await navigator.share({
						files: [file],
						title: "https://sexistential.xyz",
					});
				} catch (error) {
					if (
						!(
							error instanceof DOMException &&
							error.name === "AbortError"
						)
					) {
						toast.error("Failed to share");
					}
				}
			} else {
				await navigator.clipboard.writeText(imageBlobUrl);
				toast.success("Copied to clipboard");
			}
			setCopyPopoverOpen(true);
			setTimeout(() => setCopyPopoverOpen(false), 2000);
		}
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		toast.error(`Failed to share on ${platform},
			${errorMessage}`);
	} finally {
		setLoading(false);
	}
};
