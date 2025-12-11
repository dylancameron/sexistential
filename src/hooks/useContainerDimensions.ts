import { useState, useEffect, type RefObject } from "react";

export function useContainerDimensions(
	containerRef: RefObject<HTMLElement | null>
) {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const { width, height } =
					containerRef.current.getBoundingClientRect();
				setDimensions({ width, height });
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);

		const resizeObserver = new ResizeObserver(updateDimensions);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			window.removeEventListener("resize", updateDimensions);
			resizeObserver.disconnect();
		};
	}, [containerRef]);

	return dimensions;
}
