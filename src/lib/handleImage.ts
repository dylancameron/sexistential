// import { toast } from "sonner";

// const handleDownload = async (imageUrl: string, setLoading: (loading: boolean) => void) => {
// 	if (!imageUrl) return

// 	setLoading(true)

// 	try {
// 		const file = await fetchFile(imageUrl, "sexistential.jpg");
// 		const url = URL.createObjectURL(file);
// 		const link = document.createElement("a");
// 		link.href = url;
// 		link.download = "sexistential.jpg";
// 		document.body.appendChild(link);
// 		link.click();
// 		document.body.removeChild(link);
// 	} catch {
// 		toast.error("Failed to download image")
// 	}
// 	setLoading(false);
// }

// const handleShare = async (imageUrl: string, setLoading: (loading: boolean) => void, setCopyPopoverOpen: (copyPopoverOpen: boolean) => void) => {
// 	if (!imageUrl) {
// 		toast.error("Fill out all intersections first")
// 		return;
// 	}

// 	setLoading(true);

// 	try {
// 		const file = await fetchFile(imageUrl, "sexistential.jpg");
// 		if (
// 			navigator.share &&
// 			navigator.canShare &&
// 			navigator.canShare({ files: [file]})
// 		) {
// 			await navigator.share({
// 				files: [file],
// 				title: "https://sexistential.xyz"
// 			})
// 		} else {
// 			const blobUrl = await uploadToVercelBlob(file);
// 			if (navigator.share) {
// 				await navigator.share({
// 					url: blobUrl,
// 					title: "https://sexistential.xyz"
// 				})
// 			} else {
// 				await navigator.clipboard.writeText(blobUrl);
// 				setCopyPopoverOpen(true);
// 				toast.success("Copied to clipboard")
// 				setTimeout(() => setCopyPopoverOpen(false), 2000)
// 			}
// 		}
// 	} catch (error) {
// 			// Always show error unless it's an AbortError that you want to ignore.
// 			if (
// 				!(error instanceof DOMException && error.name === "AbortError")
// 			) {
// 				toast.error("Sharing failed. Try saving the image manually.");
// 			}
// 		} finally {
// 			setLoading(false);
// 		}
// 	};
	