"use client";

import React, { useState, useEffect } from "react";
import { ColorContext } from "@/lib/ColorContext";

export const ColorContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bgColor, setBgColor] = useState("white");
	const [overrideTextColor, setOverrideTextColor] = useState<
		string | undefined
	>();
	const [overrideBackgroundColor, setOverrideBackgroundColor] = useState<
		string | undefined
	>();

	const textColor =
		overrideTextColor ?? (bgColor === "black" ? "#fff" : "#000");

	const setColor = (color: string) => {
		setBgColor(color);
	};

	useEffect(() => {
		document.body.style.backgroundColor = bgColor;
	}, [bgColor]);

	return (
		<ColorContext.Provider
			value={{
				bgColor,
				textColor,
				setColor,
				overrideTextColor,
				setOverrideTextColor,
				overrideBackgroundColor,
				setOverrideBackgroundColor,
			}}
		>
			{children}
		</ColorContext.Provider>
	);
};
