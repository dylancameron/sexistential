async function fetchFile(memeURL: string, filename = "sexistential.jpg") {
	const response = await fetch(memeURL);
	const blob = await response.blob();
	return new File([blob], filename, { type: blob.type });
}

export default fetchFile;