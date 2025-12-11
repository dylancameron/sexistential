import { createContext, useContext } from "react";

interface ColorContextType {
	bgColor: string;
	textColor: string;
	setColor: (color: string) => void;
}

export const ColorContext = createContext<ColorContextType | null>(null);

export const useColorContext = () => {
	const ctx = useContext(ColorContext);
	if (!ctx) {
		throw new Error(
			"useColorContext must be used with a ColorContextProvider"
		)
	}
	return ctx;
}