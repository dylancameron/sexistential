const uploadToVercelBlob = async (imageBlob: Blob) => {
	const response = await fetch("/api/upload", {
		method: "PUT",
		body: imageBlob,
		headers: {
			"Content-Type": "image/jpeg",
		},
	});

	const data = await response.json();
	if (!response.ok) throw new Error("Upload failed");

	return data.url;
};

export default uploadToVercelBlob;
