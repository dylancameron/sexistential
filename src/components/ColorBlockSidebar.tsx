import React, { useState } from "react";

interface Props {
	changeColor?: (color: string) => void;
}

const colors = ["white", "black", "magenta", "yellow"];

const ColorBlockSidebar: React.FC<Props> = ({ changeColor }) => {
	const [activeColor, setActiveColor] = useState<string>("white");

	const handleClick = (color: string) => {
		setActiveColor(color);
		changeColor?.(color);
	};

	return (
		<>
			<div className="fixed top-0 right-0 h-full w-1/48 flex flex-col">
				{colors.map((color) => (
					<button
						type="button"
						title="Color"
						key={color}
						onClick={() => handleClick(color)}
						className={`flex-1 border ${
							activeColor === color
								? "border-black"
								: "border-transparent"
						}`}
						style={{ backgroundColor: color }}
					/>
				))}
			</div>
		</>
	);
};

export default ColorBlockSidebar;
