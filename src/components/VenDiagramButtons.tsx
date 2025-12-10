import React from "react";

interface VenButtonsProps {
	count: 2 | 3;
	isActive?: boolean;
	onClick?: () => void;
	color?: string; // dynamic border color
}

export const VenButtons: React.FC<VenButtonsProps> = ({
	count,
	isActive,
	onClick,
	color = "black",
}) => {
	const borderWidth = isActive ? 4 : 2;
	const size = 64;
	const overlap = 20;

	return (
		<button
			type="button"
			onClick={onClick}
			className="relative flex items-center justify-center p-4"
		>
			{count === 2 && (
				<>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							left: -overlap / 1.25,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
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
							border: `${borderWidth}px solid ${color}`,
							top: -overlap,
							left: 0,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							top: overlap / 2,
							left: -overlap,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
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
	borderColor?: string;
	activeVenn: 2 | 3 | null;
	setActiveVenn: (count: 2 | 3 | null) => void;
}

const VenDiagramButtonWrapper: React.FC<WrapperProps> = ({
	borderColor = "black",
	activeVenn,
	setActiveVenn,
}) => {
	return (
		<div className="absolute left-0 bottom-0 flex flex-col items-center gap-24 p-12">
			<VenButtons
				count={3}
				isActive={activeVenn === 3}
				color={borderColor}
				onClick={() => setActiveVenn(activeVenn === 3 ? null : 3)}
			/>

			<VenButtons
				count={2}
				isActive={activeVenn === 2}
				color={borderColor}
				onClick={() => setActiveVenn(activeVenn === 2 ? null : 2)}
			/>
		</div>
	);
};

export default VenDiagramButtonWrapper;
