import { useColorContext } from "@/hooks/useColorContext";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import React from "react";

interface VennButtonsProps {
	count: 2 | 3;
	isActive?: boolean;
	onClick?: () => void;
	color?: string; // dynamic border color
}

const VennDiagramButtons: React.FC<VennButtonsProps> = ({
	count,
	isActive,
	onClick,
	color = "black",
}) => {
	const isMobile = useDeviceDetection();
	const borderWidth = isActive ? 4 : 2;
	const finalBorder = isMobile ? borderWidth / 2 : borderWidth;
	const size = isMobile ? 32 : 64;
	const overlap = isMobile ? 10 : 20;

	return (
		<button
			type="button"
			onClick={onClick}
			className="relative flex items-center justify-center md:p-4 p-2"
		>
			{count === 2 && (
				<>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${finalBorder}px solid ${color}`,
							left: -overlap / 1.25,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${finalBorder}px solid ${color}`,
							left: overlap / 1.25,
						}}
					/>
				</>
			)}
			{count === 3 && (
				<>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${finalBorder}px solid ${color}`,
							top: -overlap,
							left: 0,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${finalBorder}px solid ${color}`,
							top: overlap / 2,
							left: -overlap,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${finalBorder}px solid ${color}`,
							top: overlap / 2,
							left: overlap,
						}}
					/>
				</>
			)}
			<span className="sr-only">{count} Circle Venn</span>
		</button>
	);
};
interface WrapperProps {
	activeVenn: 2 | 3;
	setActiveVenn: (count: 2 | 3) => void;
}

const VennDiagramButtonWrapper: React.FC<WrapperProps> = ({
	activeVenn,
	setActiveVenn,
}) => {
	const { textColor } = useColorContext();

	return (
		<div className="absolute left-0 bottom-8 sm:bottom-0 flex flex-col items-center gap-16 sm:gap-24 md:gap-16 py-6 px-8 sm:px-12 sm:py-16">
			<VennDiagramButtons
				count={3}
				isActive={activeVenn === 3}
				color={textColor}
				onClick={() => setActiveVenn(activeVenn === 3 ? 2 : 3)}
			/>

			<VennDiagramButtons
				count={2}
				isActive={activeVenn === 2}
				color={textColor}
				onClick={() => setActiveVenn(activeVenn === 2 ? 3 : 2)}
			/>
		</div>
	);
};

export default VennDiagramButtonWrapper;
