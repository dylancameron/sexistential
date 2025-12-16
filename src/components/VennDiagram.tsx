"use client";

import { useColorContext } from "@/hooks/useColorContext";
import { useEffect, useRef, useState } from "react";
import { VennSection } from "@/components/VennSection";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
// import { captureVennDiagram, handleSocialShare } from "@/lib/shareHelpers";
import { generateRandomVenn, getVennBounds } from "@/lib/vennHelpers";
import ShareButtonGroup from "./ShareButtonGroup";

interface VenDiagramProps {
	count: 2 | 3;
	isActive?: boolean;
	size?: number;
}

interface Section {
	top: number;
	left: number;
	width: number;
	height: number;
}

export default function VennDiagram({
	count,
	isActive = true,
	size = 800,
}: VenDiagramProps) {
	const { textColor } = useColorContext();
	const { width, height } = getVennBounds(size, count);
	const isMobile = useDeviceDetection();

	const vennRef = useRef<HTMLDivElement>(null);
	const [, setCopyPopoverOpen] = useState(false);

	const borderWidth = isActive ? 6 : 3;

	const [scale, setScale] = useState(1);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

	const numSections = count === 2 ? 3 : 7;

	const default2Circle: string[] = ["sexi", "robyn", "stential"];

	const [sectionsText, setSectionsText] = useState<string[]>(
		count === 2 ? default2Circle : Array(numSections).fill("")
	);

	const randomize = () => {
		setSectionsText(generateRandomVenn(count));
	};

	// Scale diagram to fit viewport
	useEffect(() => {
		const updateScale = () => {
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			// Mobile (full-width)
			if (isMobile) {
				setScale(vw / width);
				return;
			}

			setScale(Math.min(vw / width, vh / height));
		};

		updateScale();
		window.addEventListener("resize", updateScale);
		return () => window.removeEventListener("resize", updateScale);
	}, [width, height, isMobile]);

	const getSections = (): Section[] => {
		const overlap = size / 2;
		if (count === 2) {
			const leftCircle = 0;
			const rightCircle = width - size;

			return [
				{
					top: size * 0.25,
					left: leftCircle,
					width: size - overlap, // left-only
					height: size * 0.5,
				},
				{
					top: size * 0.25,
					left: leftCircle + size - overlap, // the intersection
					width: overlap,
					height: size * 0.5,
				},
				{
					top: size * 0.25,
					left: rightCircle + overlap, // right-only
					width: size - overlap,
					height: size * 0.5,
				},
			];
		} else {
			// 3-circle layout
			const topCircleLeft = (width - size) / 2;
			const bottomRightCircleLeft = width - size;
			const half = size / 2;
			const quarter = size / 4;
			return [
				{
					top: quarter / 2,
					left: topCircleLeft,
					width: size,
					height: half,
				}, // Top only
				{
					top: half + quarter * 1.5,
					left: 0,
					width: half + quarter,
					height: quarter,
				},
				// Bottom-left only
				{
					top: half + quarter * 1.5,
					left: bottomRightCircleLeft + quarter,
					width: half + quarter,
					height: quarter,
				}, // Bottom-right only
				{
					top: half * 1.125,
					left: topCircleLeft + quarter * 0.25,
					width: quarter * 1.5,
					height: quarter,
				}, // Top ∩ Bottom-left
				{
					top: half * 1.125,
					left: topCircleLeft + half * 1.125,
					width: quarter * 1.5,
					height: quarter,
				}, // Top ∩ Bottom-right
				{
					top: half * 2,
					left: topCircleLeft + quarter * 1.25,
					width: quarter * 1.5,
					height: quarter,
				},
				// Bottom-left ∩ Bottom-right
				{
					top: half * 1.5,
					left: topCircleLeft + quarter * 1.5,
					width: quarter,
					height: quarter,
				}, // Center
			];
		}
	};

	const sections = getSections();

	// const handleFacebookShare = async () => {
	// 	if (!vennRef.current) return;
	// 	const blob = await captureVennDiagram(vennRef.current);
	// 	if (!blob) return;
	// 	const url = URL.createObjectURL(blob);

	// 	handleSocialShare("facebook", setLoading, url, setCopyPopoverOpen);
	// }

	// const handleInstagramShare = async () => {
	// 	if (!vennRef.current) return;
	// 	const blob = await captureVennDiagram(vennRef.current);
	// 	if (!blob) return;
	// 	const url = URL.createObjectURL(blob)

	// 	handleSocialShare("instagram", setLoading, url, setCopyPopoverOpen);
	// }

	// const handleCopyShare = async () => {
	// 	if (!vennRef.current) return;
	// 	const blob = await captureVennDiagram(vennRef.current);
	// 	if (!blob) return;
	// 	const url = URL.createObjectURL(blob);

	// 	handleSocialShare("copy", setLoading, url, setCopyPopoverOpen);
	// }

	return (
		<>
			<div
				ref={vennRef}
				className="w-full h-full flex items-center justify-center overflow-hidden"
			>
				{/* SCALE WRAPPER */}
				<div
					style={{
						transform: `scale(${scale * 0.875})`,
						transformOrigin: "center",
						position: "relative",
						zIndex: 999,
					}}
				>
					{/* FIXED SIZE VEN DIAGRAM BOX */}
					<div
						style={{
							width,
							height,
							position: "relative",
						}}
					>
						{count === 2 && (
							<>
								<div
									className="absolute rounded-full"
									style={{
										width: size,
										height: size,
										border: `${borderWidth}px solid ${textColor}`,
										top: 0,
										left: 0,
									}}
								/>
								<div
									className="absolute rounded-full"
									style={{
										width: size,
										height: size,
										border: `${borderWidth}px solid ${textColor}`,
										top: 0,
										left: width - size,
									}}
								/>
							</>
						)}

						{count === 3 && (
							<>
								{/* Top circle centered horizontally */}
								<div
									className="absolute rounded-full"
									style={{
										width: size,
										height: size,
										border: `${borderWidth}px solid ${textColor}`,
										top: 0,
										left: (width - size) / 2, // center top circle
									}}
								/>
								{/* Bottom-left */}
								<div
									className="absolute rounded-full"
									style={{
										width: size,
										height: size,
										border: `${borderWidth}px solid ${textColor}`,
										top: size / 2, // overlap by half
										left: 0,
									}}
								/>
								{/* Bottom-right */}
								<div
									className="absolute rounded-full"
									style={{
										width: size,
										height: size,
										border: `${borderWidth}px solid ${textColor}`,
										top: size / 2,
										left: width - size,
									}}
								/>
							</>
						)}
					</div>
					{sections.map((sec, idx) => (
						<VennSection
							key={idx}
							idx={idx}
							sec={sec}
							value={sectionsText[idx] ?? ""}
							textColor={textColor}
							placeholder=""
							focusedIndex={focusedIndex}
							setFocusedIndex={setFocusedIndex}
							setSectionsText={setSectionsText}
							baseFont={72}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col items-end gap-0 md:gap-2 absolute bottom-0 right-0 md:pr-12 pr-6 pb-12">
				<ShareButtonGroup
					vennRef={vennRef}
					setCopyPopoverOpen={setCopyPopoverOpen}
				/>
				{/* <button
					type="button"
					// onClick={share}
					style={{
						color: textColor,
					}}
					className={`md:text-6xl sm:text-4xl text-2xl tracking-wide`}
				>
					share
				</button> */}
				<button
					type="button"
					onClick={randomize}
					style={{
						color: textColor,
					}}
					className={`md:text-6xl sm:text-4xl text-2xl tracking-wide`}
				>
					randomize
				</button>
			</div>
		</>
	);
}
