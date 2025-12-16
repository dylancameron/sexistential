import type React from "react";
import { useScalingText } from "@/hooks/useScalingText";
import {
	AutosizeTextarea,
	type AutosizeTextAreaRef,
} from "@/components/ui/auto-resize-textarea";

export interface VennSectionBox {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface VennSectionProps {
	idx: number;
	sec: VennSectionBox;
	value: string;
	setSectionsText: React.Dispatch<React.SetStateAction<string[]>>;
	focusedIndex: number | null;
	setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>;
	textColor: string;
	placeholder: string;
	baseFont: number;
}

export function VennSection({
	idx,
	sec,
	value,
	focusedIndex,
	setFocusedIndex,
	setSectionsText,
	textColor,
	placeholder,
	baseFont,
}: VennSectionProps) {
	const { ref, scale } = useScalingText(value, sec.width, sec.height);

	return (
		<div
			style={{
				position: "absolute",
				top: sec.top,
				left: sec.left,
				width: sec.width,
				height: sec.height,
				zIndex: 10,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{/* Placeholder */}
			{focusedIndex !== idx && !value && (
				<span
					style={{
						position: "absolute",
						color: textColor,
						opacity: 0.75,
						fontSize: baseFont,
						pointerEvents: "none",
					}}
				>
					{placeholder}
				</span>
			)}

			{/* Scaled container */}
			<div
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "center",
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<AutosizeTextarea
					ref={ref as React.Ref<AutosizeTextAreaRef>}
					value={value}
					onChange={(e) => {
						setSectionsText((prev) => {
							const next = [...prev];
							next[idx] = e.target.value;
							return next;
						});
					}}
					onFocus={() => setFocusedIndex(idx)}
					onBlur={() => setFocusedIndex(null)}
					style={{
						fontSize: baseFont,
						outline: "none",
						resize: "none",
						color: textColor,
					}}
				/>
			</div>
		</div>
	);
}
