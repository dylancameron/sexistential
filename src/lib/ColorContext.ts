import { createContext } from "react";

export interface ColorContextType {
  bgColor: string;
  textColor: string;
  setColor: (color: string) => void;
  overrideTextColor: string | undefined;
  setOverrideTextColor: (color?: string) => void;
}

export const ColorContext = createContext<ColorContextType>({
  bgColor: "white",
  textColor: "#000",
  setColor: () => {},
  overrideTextColor: undefined,
  setOverrideTextColor: () => {},
});