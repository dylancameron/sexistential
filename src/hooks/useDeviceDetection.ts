"use client"

import { useState, useEffect } from "react";

export function useDeviceDetection() {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const checkMobile = () => {
			const isMobileDevice =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				) ||
				"ontouchstart" in window ||
				navigator.maxTouchPoints > 0;
			setIsMobile(isMobileDevice);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	}, []);
	return isMobile;
}
