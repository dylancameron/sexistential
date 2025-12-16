import React from "react";
import { useColorContext } from "@/hooks/useColorContext";
import Link from "next/link";

interface NavbarProps {
	brandText?: string;
	brandHref?: string;
	actionText?: string;
	actionHref?: string; // used if not a button
	asButton?: boolean; // render action as a button
	onActionClick?: () => void;
	textColorOverride?: string;
}

const Navbar: React.FC<NavbarProps> = ({
	brandText = "sexistential.xyz",
	brandHref = "/sexistential",
	actionText = "sign up",
	actionHref = "",
	asButton = true,
	onActionClick,
}) => {
	const { textColor } = useColorContext();

	return (
		<header className="fixed top-0 p-6 sm:pr-9 md:pr-12 w-full flex justify-between items-center z-50">
			{/* Brand */}
			<Link
				href={brandHref}
				className="sm:text-4xl md:text-6xl text-2xl"
				style={{ color: textColor }}
			>
				{brandText}
				<span className="sr-only">{brandText}</span>
			</Link>

			{/* Action */}
			{asButton ? (
				<button
					type="button"
					onClick={onActionClick}
					className="sm:text-4xl md:text-6xl text-2xl"
					style={{ color: textColor }}
				>
					{actionText}
					<span className="sr-only">{actionText}</span>
				</button>
			) : (
				<a
					href={actionHref}
					className="sm:text-4xl md:text-6xl text-2xl"
					style={{ color: textColor }}
				>
					{actionText}
					<span className="sr-only">{actionText}</span>
				</a>
			)}
		</header>
	);
};

export default Navbar;
