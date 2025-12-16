import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
	try {
		const body = await request.arrayBuffer();

		// Ensure the request body has content
		if (body.byteLength === 0) {
			return NextResponse.json(
				{ error: "Empty request body" },
				{ status: 400 }
			);
		}

		// Upload to Vercel Blob Storage
		const { url } = await put(`sexistential-${Date.now()}.jpg`, body, {
			contentType: "image/jpeg",
			access: "public",
		});

		// Return the uploaded file URL
		return NextResponse.json({ url }, { status: 200 });
	} catch (error) {
		console.error("Vercel Blob Upload Error:", error);
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 }
		);
	}
}
