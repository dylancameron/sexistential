"use client";

import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { captureVennDiagram, handleSocialShare } from "@/lib/shareHelpers";
import { toast } from "sonner";

export default function ShareButtonGroup({
	vennRef,
	setLoading,
	setCopyPopoverOpen,
}: {
	vennRef: React.RefObject<HTMLDivElement | null>;
	setLoading?: (loading: boolean) => void;
	setCopyPopoverOpen?: (open: boolean) => void;
}) {
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
		<div className="relative flex flex-col items-end gap-2">
			<motion.button
				onTap={() => setOpen(!open)}
				className="md:text-6xl sm:text-4xl text-2xl tracking-wide"
			>
				share
			</motion.button>

			<AnimatePresence>
				{open && (
					<motion.div
						style={{ pointerEvents: "auto" }}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className="flex flex-col gap-2 mt-2"
					>
						<motion.button
							onTap={() => handleClick("facebook")}
							whileHover={{ scale: 1.1 }}
							className="text-lg"
						>
							Facebook
						</motion.button>
						<motion.button
							onTap={() => handleClick("instagram")}
							whileHover={{ scale: 1.1 }}
							className="text-lg"
						>
							Instagram
						</motion.button>
						<motion.button
							onTap={() => handleClick("copy")}
							whileHover={{ scale: 1.1 }}
							className="text-lg"
						>
							Copy
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
