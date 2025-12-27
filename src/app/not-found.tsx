import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<div className="fixed z-0 inset-0 flex items-center justify-center pointer-events-none">
			<div className="absolute inset-0 flex items-center justify-center w-full p-2">
				<div className="fixed m-auto w-auto bg-primary-background backdrop-blur-2xl flex items-center justify-center z-10 py-3 gap-2 pl-6 pr-4 rounded-full border-2 border-black">
					<h1 className="text-3xl text-primary">404</h1>
					<span className="text-primary opacity-50 text-3xl lowercase">
						{" "}
						Page Not Found
					</span>
					<Link
						href="/"
						className="text-foreground pointer-events-auto transition-colors duration-300 ml-2 group"
					>
						<ArrowUpRight className="size-8" />
					</Link>
				</div>
			</div>
		</div>
	);
}
