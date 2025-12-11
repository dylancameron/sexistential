import { useLayoutEffect, useRef, useState } from "react";

export function useScalingText(
	text: string, 
	maxWidth: number, 
	maxHeight: number, 
) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [scale, setScale] = useState(1);

	useLayoutEffect(() => {
		if (!ref.current) return;

		const measure = () => {
			const containerWidth = maxWidth;
			const containerHeight  = maxHeight;

			// Approximate width of the text
			const approxTextWidth = ref.current!.scrollWidth;
			const approxTextHeight = ref.current!.scrollHeight;

			const scaleWidth = containerWidth / approxTextWidth || 1;
			const scaleHeight = containerHeight / approxTextHeight || 1;

			setScale(Math.min(scaleWidth, scaleHeight, 1));
		}

		measure();
	}, [text, maxWidth, maxHeight]);

	return { ref, scale }
}