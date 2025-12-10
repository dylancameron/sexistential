import React from "react";

interface VenDiagramProps {
	count: 2 | 3;
	isActive?: boolean;
	color?: string;
	size?: number;
}

const VenDiagram: React.FC<VenDiagramProps> = ({
	count,
	isActive = true,
	color = "black",
	size = 500,
}) => {
	const borderWidth = isActive ? 6 : 3;
	const overlap = size / 3;

	return (
		<div className="w-full h-full flex items-center justify-center mx-auto">
			{count === 2 && (
				<div className="mx-auto w-full inset-0 flex items-center justify-center">
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							left: `-${overlap / 2}px`,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							left: `${overlap / 2}px`,
						}}
					/>
				</div>
			)}
			{count === 3 && (
				<div className="mx-auto inset-0 flex items-center justify-center">
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							top: `-${overlap / 2}px`,
							left: 0,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							top: `${overlap / 2}px`,
							left: `-${overlap}px`,
						}}
					/>
					<div
						className="absolute rounded-full"
						style={{
							width: size,
							height: size,
							border: `${borderWidth}px solid ${color}`,
							top: `${overlap / 2}px`,
							left: `${overlap}px`,
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default VenDiagram;
