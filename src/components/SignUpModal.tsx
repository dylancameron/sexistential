"use client";

import React, { useEffect, useState } from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignUpModalProps {
	children?: React.ReactNode;
	open: boolean;
	setOpen: (open: boolean) => void;
	title?: string;
	description?: string;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
	open,
	setOpen,
	title = "sign up",
	description = "join robyn's mailing list",
}) => {
	const isMobile = useDeviceDetection();

	const finalTextColor = "#000";
	const bgColor = "#fff";

	if (!isMobile) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>{title}</DialogTrigger>
				<DialogContent
					className={`sm:max-w-106.25 md:max-w-2xl`}
					style={{
						background: bgColor,
						color: finalTextColor,
						border: `2px solid ${finalTextColor}`,
					}}
				>
					<DialogHeader className="text-left">
						<DialogTitle className="tracking-wide text-2xl sm:text-4xl md:text-5xl">
							{title}
						</DialogTitle>
						<DialogDescription
							className="tracking-wider text-xl sm:text-2xl"
							style={{
								color: finalTextColor,
							}}
						>
							{description}
						</DialogDescription>
					</DialogHeader>
					<SignUpForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{title}</DrawerTrigger>
			<DrawerContent
				style={{
					background: bgColor,
					color: finalTextColor,
					border: `2px solid ${finalTextColor}`,
				}}
				className="px-0 py-0"
			>
				<DrawerHeader
					className="text-left"
					style={{
						color: finalTextColor,
					}}
				>
					<DrawerClose asChild className="absolute top-4 right-4">
						<XIcon className="size-6" />
					</DrawerClose>
					<DrawerTitle
						style={{
							color: finalTextColor,
						}}
						className="text-2xl tracking-wide"
					>
						{title}
					</DrawerTitle>
					<DrawerDescription
						style={{
							color: finalTextColor,
						}}
						className="text-xl opacity-50 tracking-wide"
					>
						{description}
					</DrawerDescription>
				</DrawerHeader>
				<SignUpForm />
			</DrawerContent>
		</Drawer>
	);
};

export default SignUpModal;

const formKey = "";
const formEndPoint = "";

function SignUpForm() {
	const finalTextColor = "#000";
	const bgColor = "#fff";

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [consent, setConsent] = useState<boolean>(false);

	const [nameError, setNameError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [consentError, setConsentError] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const [globalError, setGlobalError] = useState<string>("");

	const [success, setSuccess] = useState<boolean>(false);
	const [successTimer, setSuccessTimer] = useState<boolean>(false);

	const [validated, setValidated] = useState<boolean>(false);

	useEffect(() => {
		if (!success || !successTimer) {
			return;
		}
		let animationFrameId: number;
		const startTime = performance.now();

		const animate = (now: number) => {
			const newElapsed = (now - startTime) / 2000;
			if (newElapsed >= 10) {
				setSuccess(false);
				return;
			}
			animationFrameId = requestAnimationFrame(animate);
		};

		animationFrameId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrameId);
	}, [success, successTimer]);

	useEffect(() => {
		const isValid = !!(name && email && consent);
		if (isValid !== validated) setValidated(isValid);
	}, [name, email, consent, validated]);

	// Validate name
	const validateName = () => {
		if (!name.trim()) {
			setNameError("Please enter your full name");
			return false;
		}
		setNameError("");
		return true;
	};

	const validateEmail = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) {
			setEmailError("Please enter your email address");
			return false;
		} else if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address.");
			return false;
		}
		setEmailError("");
		return true;
	};

	const validateConsent = () => {
		if (!consent) {
			setConsentError("Please agree to our terms and conditions");
			return false;
		}
		setConsentError("");
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setGlobalError("");

		// Validate all fields
		const nameValid = validateName();
		const emailValid = validateEmail();
		const consentValid = validateConsent();

		if (!(nameValid && emailValid && consentValid)) {
			setGlobalError("We couldn't process your submission.");
			setLoading(false);
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("gdpr", consent ? "yes" : "no");
		formData.append("list", formKey);
		formData.append("subform", "yes");

		// Send data to the form endpoint
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

		try {
			await fetch(formEndPoint, {
				method: "POST",
				mode: "no-cors", // Use no-cors for opaque responses
				body: formData,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			setSuccess(true);
			setSuccessTimer(true);
		} catch (error) {
			clearTimeout(timeoutId);
			// Don't submit a fallback <form>. Just show an error toast and stay put.
			console.error("Submission error:", error);
			setGlobalError(
				error instanceof Error
					? error.message
					: "Network error. Please try again later."
			);
		} finally {
			setLoading(false);

			setTimeout(() => {
				setName("");
				setEmail("");
				setConsent(false);
				setValidated(false);
				setNameError("");
				setEmailError("");
				setConsentError("");
				setSuccess(false);
				setSuccessTimer(false);
			}, 10000);
		}
	};
	return (
		<>
			<form className={`w-full px-4 sm:px-0`}>
				<input
					name="name"
					type="text"
					placeholder="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					style={{
						color: finalTextColor,
					}}
					className={`mb-2 sm:mb-0 text-2xl w-full sm:text-4xl md:text-5xl placeholder-[${finalTextColor}] border-none outline-none`}
				/>
				<input
					type="email"
					placeholder="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					style={{
						color: finalTextColor,
					}}
					className={`mb-2 text-2xl w-full sm:text-4xl md:text-5xl placeholder-[${finalTextColor}] border-none outline-none`}
				/>

				<ConsentBlock />
				<button
					type="submit"
					aria-label="Submit"
					style={{
						border: `2px solid ${finalTextColor}`,
					}}
					className={`flex rounded-sm items-center justify-center w-full py-2 outline-none sm:text-4xl md:text-5xl text-2xl`}
					disabled={loading}
					onClick={handleSubmit}
				>
					submit
				</button>

				{globalError && (
					<div className="mt-2">
						<Alert
							variant="destructive"
							style={{
								background: bgColor,
								color: finalTextColor,
							}}
						>
							<AlertCircleIcon />
							<AlertTitle className="tracking-wider text-xs">
								Unable to subscribe. Please verify your
								information:
							</AlertTitle>
							<AlertDescription>
								<ul
									className="list-inside tracking-wider list-disc text-xs"
									style={{
										color: finalTextColor,
									}}
								>
									{nameError && <li>{nameError}</li>}
									{emailError && <li>{emailError}</li>}
									{consentError && <li>{consentError}</li>}
								</ul>
							</AlertDescription>
						</Alert>
					</div>
				)}
			</form>
			<div className="flex items-center justify-between gap-2 px-4 sm:px-0 my-3 sm:my-0">
				<a
					title=""
					className={`hover:underline ${finalTextColor} text-xs`}
					href="https://beggars.com/privacypolicy/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Privacy Policy
				</a>
				<a
					className={`hover:underline ${finalTextColor} text-xs`}
					href="https://beggars.com/cookiepolicy/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Cookie Policy
				</a>
			</div>
		</>
	);
}

const labelUrl = "https://y-o-u-n-g.com";

const sanitizeLabelUrl = labelUrl
	.replace(/^https?:\/\//, "") // removes http:// or https://
	.replace(/[^a-zA-Z0-9.-]/g, ""); // allows only domain-safe characters

const ConsentBlock = () => {
	const artistName = "robyn";
	const labelEmail = `${artistName}@${sanitizeLabelUrl}`;
	const [readMore, setReadMore] = useState<boolean>(false);

	const finalTextColor = "#000";

	const handleReadMore = () => {
		setReadMore(!readMore);
	};

	const readmoreButtonStyle = cn(
		"text-[10px] underline sm:text-xs cursor-pointer outline-none",
		readMore ? `${finalTextColor} opacity-50` : `${finalTextColor}`
	);

	return (
		<>
			<div className="flex flex-col gap-2 items-start pb-2 gap-x-1">
				<span
					className={`text-xs text-justify tracking-wider ${
						readMore ? `${finalTextColor}` : `${finalTextColor}`
					}`}
				>
					<strong>Marketing permissions</strong>: By agreeing, I give
					my consent to {artistName} to be in touch with me via email
					using the information I have provided in this form for the
					purpose of news, updates and marketing.
					{readMore && (
						<>
							<br></br>
							<br></br>
							<span className="text-xs">
								<strong>What to expect: </strong>
								If you wish to withdraw your consent and stop
								hearing from us, simply click the unsubscribe
								link at the bottom of every email we send or
								contact us at{" "}
								<a
									className={`${finalTextColor}`}
									href={`mailto:${labelEmail}`}
								>
									{labelEmail}
								</a>
								. We value and respect your personal data and
								privacy. To view our privacy policy, please
								visit our website. By submitting this form, you
								agree that we may process your information in
								accordance with these terms.{" "}
							</span>
						</>
					)}{" "}
					<button
						type="button"
						onClick={handleReadMore}
						className={cn(
							"capitalize hover:underline",
							readmoreButtonStyle
						)}
					>
						{readMore ? "Show less" : "...More"}
					</button>
				</span>
				<div style={{ display: "none" }}>
					<label htmlFor="hp">HP</label>
					<input type="text" name="hp" id="hp" />
				</div>
				<input type="hidden" name="list" value={formKey} />
				<input type="hidden" name="subform" value="yes" />
			</div>
		</>
	);
};
