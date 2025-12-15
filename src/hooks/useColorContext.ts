import { useContext } from "react";
import { ColorContext } from "@/lib/ColorContext";

export const useColorContext = () => {
	const ctx = useContext(ColorContext);
	if (!ctx) {
		throw new Error(
			"useColorContext must be used with a ColorContextProvider"
		)
	}
	return ctx;
}