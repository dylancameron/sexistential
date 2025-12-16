"use client";

import { useColorContext } from "@/hooks/useColorContext";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import React, { useState } from "react";

const colors = ["white", "black", "#a40051", "#fff59b"];

const ColorBlockBar: React.FC = () => {
	const isMobile = useDeviceDetection();
	const { setColor, bgColor } = useColorContext();
	const [activeColor, setActiveColor] = useState<string>(bgColor || "white");

	const handleClick = (color: string) => {
		setActiveColor(color);
		setColor(color);
	};

	// Desktop
	if (!isMobile) {
		return (
			<div className="fixed z-20 top-0 right-0 h-full w-1/48 flex flex-col">
				{colors.map((color) => (
					<button
						type="button"
						key={color}
						title={`Set background color to ${color}`}
						onClick={() => handleClick(color)}
						className={`border-none outline-none transition-all 500ms ease-in-out ${
							activeColor === color ? "flex-2" : "flex-1"
						}`}
						style={{ backgroundColor: color }}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="fixed z-20 bottom-0 left-0 right-0 w-full flex h-1/48">
			{colors.map((color) => (
				<button
					type="button"
					key={color}
					title={`Set background color to ${color}`}
					onClick={() => handleClick(color)}
					className={`border-none outline-none transition-all 500ms ease-in-out ${
						activeColor === color ? "flex-2" : "flex-1"
					}`}
					style={{ backgroundColor: color }}
				/>
			))}
		</div>
	);
};

export default ColorBlockBar;
