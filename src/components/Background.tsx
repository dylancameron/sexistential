import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import React from "react";

interface BackgroundProps {
	className?: string;
	children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ className, children }) => {
	const isMobile = useDeviceDetection();
	return (
		<div
			className={className}
			style={{
				backgroundSize: isMobile ? "contain" : "cover",
				backgroundPosition: "center",
				maxHeight: "100dvh",
				minWidth: "100dvw",
				backgroundImage: "url(/images/robyn-sparkler.jpg)",
			}}
		>
			{children}
		</div>
	);
};

export default Background;
