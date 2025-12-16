"use client";

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center h-screen m-auto gap-4">
			<div className="flex items-center justify-center w-full h-full gap-2">
				<Spinner />
				<h1 className="text-xl animate-pulse font-heading-regular">
					Loading
					<span className="text-2xl animate-dot-delay">.</span>
					<span className="text-2xl animate-dot-delay2">.</span>
					<span className="text-2xl animate-dot-delay3">.</span>
				</h1>
			</div>
		</div>
	);
}
