"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordProtectProps {
	children?: React.ReactNode;
}

const PasswordProtect: React.FC<PasswordProtectProps> = ({ children }) => {
	const [isPassVisible, setIsPassVisible] = useState(false);
	const [isIncorrect, setIsIncorrect] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [shake, setShake] = useState(false);

	const togglePasswordVisibility = () => setIsPassVisible(!isPassVisible);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			if (password.trim() === "opensesame") {
				setIsAuthenticated(true);
			} else {
				setIsIncorrect(true);
				setShake(true);
				setPassword("");
				setTimeout(() => setShake(false), 1000);
			}
			setIsLoading(false);
		}, 1000); // pretend to "check" password
	};

	useEffect(() => {
		if (isIncorrect) {
			const timer = setTimeout(() => setIsIncorrect(false), 1500);
			return () => clearTimeout(timer);
		}
	}, [isIncorrect]);

	if (isAuthenticated) {
		return <div className="animate-fadeIn p-4">{children}</div>;
	}

	return (
		<div className="relative flex flex-col items-center justify-center min-h-screen text-center">
			<div className={cn(shake && "animate-shake")}>
				<form
					id="PasswordProtectForm"
					onSubmit={handleSubmit}
					className={cn(
						"flex flex-col w-full items-center space-y-2 md:space-y-4 px-2 md:px-6 md:py-12 bg-transparent rounded transition-all duration-200"
					)}
				>
					<div className="relative w-full">
						<input
							id="password"
							autoComplete="off"
							name="password"
							type={isPassVisible ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={
								isLoading ? "verifying..." : "password"
							}
							autoFocus
							className={cn(
								"mb-2 sm:mb-0 text-2xl w-full sm:text-4xl md:text-5xl border-none outline-none tracking-wider",
								isIncorrect
									? "border-red-500 ring-red-500"
									: "border-primary focus:ring-primary-light/50"
							)}
							required
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="absolute right-0 top-1/2 -translate-y-1/2"
							tabIndex={-1}
						>
							{isPassVisible ? (
								<EyeOffIcon className="inline-block size-6 sm:size-9 md:size-12" />
							) : (
								<EyeIcon className="inline-block size-6 sm:size-9 md:size-12" />
							)}
						</button>
					</div>

					<button
						type="submit"
						className={`flex border-3 md:border-4 rounded-sm items-center justify-center w-full py-2 outline-none sm:text-4xl md:text-5xl text-2xl hover:bg-black hover:text-white transition-colors duration-200 ${
							isIncorrect ? "border-red-500" : "border-black"
						}`}
						disabled={isLoading}
					>
						{isLoading ? (
							<div className="flex items-center justify-center gap-2">
								checking
								<Spinner className="size-6 sm:size-9 md:size-12" />
							</div>
						) : (
							"enter"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default PasswordProtect;
