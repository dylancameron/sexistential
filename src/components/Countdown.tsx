import { useColorContext } from "@/hooks/useColorContext";
import { useState, useEffect, useRef } from "react";
import { SlidingNumber } from "./ui/sliding-number-roller";

type CountdownProps = {
	targetDate: Date;
	allowColorChange?: boolean;
	setAllowColorChange?: () => void;
};

export default function CountdownComponent({
	targetDate,
	allowColorChange,
}: CountdownProps) {
	const { textColor, bgColor } = useColorContext();
	const color = allowColorChange ? textColor : "#fff";
	const backgroundColor = allowColorChange ? bgColor : "transparent";

	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const prevTime = useRef(timeLeft);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const diff = targetDate.getTime() - now.getTime();
			if (diff < 0) {
				setTimeLeft({
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
				});
				return;
			}
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
			setTimeLeft({ days, hours, minutes, seconds });
		}, 1000);

		return () => clearInterval(interval);
	}, [targetDate]);

	useEffect(() => {
		prevTime.current = timeLeft;
	}, [timeLeft]);

	const textShadowEffect = "5px 5px 5px rgba(0, 0, 0, 0.25);";

	return (
		<div
			className="flex flex-col items-center justify-center h-screen md:gap-6 sm:gap-4 gap-2 absolute inset-0 z-0"
			style={{
				background: backgroundColor,
			}}
		>
			<div className="flex gap-2 flex-row">
				<div className="px-6 py-4">
					<SlidingNumber
						number={timeLeft.days}
						padStart
						className="text-4xl sm:text-6xl md:text-8xl"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
						inView
					/>
					<div
						className="text-sm"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					>
						Days
					</div>
				</div>
				<div className="px-6 py-4">
					<SlidingNumber
						number={timeLeft.hours}
						padStart
						className="text-4xl sm:text-6xl md:text-8xl"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					/>
					<div
						className="text-sm"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					>
						Hours
					</div>
				</div>
				<div className="px-6 py-4">
					<SlidingNumber
						number={timeLeft.minutes}
						padStart
						className="text-4xl sm:text-6xl md:text-8xl"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					/>
					<div
						className="text-sm"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					>
						Minutes
					</div>
				</div>
				<div className="px-6 py-4">
					<SlidingNumber
						number={timeLeft.seconds}
						padStart
						className="text-4xl sm:text-6xl md:text-8xl"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					/>
					<div
						className="text-sm"
						style={{
							color: color,
							textShadow: textShadowEffect,
						}}
					>
						Seconds
					</div>
				</div>
			</div>
		</div>
	);
}
