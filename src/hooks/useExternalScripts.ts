"use client";
/**
 * Use this hook to load external scripts dynamically.
 * @param url - The URL of the script to load.
 * Primarily used for loading external widgets for Bandsintown or Seated
 */

import { useEffect } from "react";

export function useExternalScripts({ url }: { url: string }) {
	useEffect(() => {
		const head = document.querySelector("head");
		const script = document.createElement("script");

		script.setAttribute("src", url);
		head?.appendChild(script);

		return () => {
			head?.removeChild(script);
		};
	}, [url]);
}
