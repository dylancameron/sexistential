"use client"

import { createContext, useContext } from "react";

interface NavbarContextType {
	navbarHeight: number;
	onHeightChange: (height: number) => void;
}

export const NavbarContext = createContext<NavbarContextType>({
	navbarHeight: 0,
	onHeightChange: () => {},
});

export const useNavbarContext = () => {
	const context = useContext(NavbarContext);
	if (!context) {
		throw new Error(
			"useNavbarContext must be used within a NavbarProvider"
		);
	}
	return context;
};
