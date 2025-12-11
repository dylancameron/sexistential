import React, { useState, useEffect } from "react";
import { ColorContext } from "@/hooks/useColorContext";

export const ColorContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bgColor, setBgColor] = useState("white");

	const textColor = bgColor === "black" ? "#fff" : "#000";

	const setColor = (color: string) => {
		setBgColor(color);
	};

	useEffect(() => {
		document.body.style.backgroundColor = bgColor;
	}, [bgColor]);

	return (
		<ColorContext.Provider value={{ bgColor, textColor, setColor }}>
			{children}
		</ColorContext.Provider>
	);
};
