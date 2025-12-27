"use client";

import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { captureVennDiagram, handleSocialShare } from "@/lib/shareHelpers";
import { toast } from "sonner";
import { useColorContext } from "@/hooks/useColorContext";

export default function ShareButtonGroup({
	vennRef,
	setLoading,
	setCopyPopoverOpen,
}: {
	vennRef: React.RefObject<HTMLDivElement | null>;
	setLoading?: (loading: boolean) => void;
	setCopyPopoverOpen?: (open: boolean) => void;
}) {
	const { textColor } = useColorContext();
	const [open, setOpen] = useState(false);

	const handleClick = async (platform: "facebook" | "instagram" | "copy") => {
		if (!vennRef.current) return;
		const blob = await captureVennDiagram(vennRef.current);
		if (!blob) {
			toast.error("Failed to capture image");
			return;
		}
		const url = URL.createObjectURL(blob);
		handleSocialShare(
			platform,
			setLoading ?? (() => {}),
			url,
			setCopyPopoverOpen ?? (() => {})
		);
	};

	return (
		<div className="relative flex flex-row-reverse items-end gap-2">
			<motion.button
				onClick={() => setOpen(!open)}
				style={{
					color: textColor,
				}}
				className="md:text-6xl sm:text-4xl text-2xl tracking-wide"
			>
				{open ? "✕" : "share"}
			</motion.button>

			{open && (
				<AnimatePresence initial={true}>
					<motion.div
						style={{ pointerEvents: "auto" }}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className="flex flex-col gap-0 items-end"
					>
						<motion.button
							onTap={() => handleClick("facebook")}
							whileHover={{ scale: 1.1 }}
							className="text-lg"
							style={{
								color: textColor,
							}}
						>
							facebook
						</motion.button>
						<motion.button
							onTap={() => handleClick("instagram")}
							whileHover={{ scale: 1.1 }}
							className="text-lg"
							style={{
								color: textColor,
							}}
						>
							instagram
						</motion.button>
						<motion.button
							onTap={() => handleClick("copy")}
							whileHover={{ scale: 1.1 }}
							className="text-lg"
							style={{
								color: textColor,
							}}
						>
							copy link
						</motion.button>
					</motion.div>
				</AnimatePresence>
			)}
		</div>
	);
}
