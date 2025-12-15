import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group, Vector3 } from "three";

type CountdownDigitProps = {
	digit: string;
	prev: string;
	fontSize: number;
	position: Vector3;
	speed?: number;
};

function CountdownDigit({
	digit,
	prev,
	fontSize,
	position,
	speed = 6,
}: CountdownDigitProps) {
	const ref = useRef<Group>(null);
	const progress = useRef(1);
	const [display, setDisplay] = useState(prev);

	// reset scroll when digit changes
	useEffect(() => {
		if (digit !== prev) {
			progress.current = 0;
			requestAnimationFrame(() => setDisplay(prev));
		}
	}, [digit, prev]);

	useFrame((_state, delta) => {
		if (!ref.current) return;

		if (progress.current < 1) {
			progress.current = Math.min(1, progress.current + delta * speed);
			const yOffset = fontSize * (1 - progress.current);

			ref.current.position.y = -yOffset;

			if (progress.current >= 1) {
				setDisplay(digit);
				ref.current.position.y = 0;
			}
		}
	});

	return (
		<Text
			ref={ref}
			fontSize={fontSize}
			color="#fff"
			anchorX="center"
			anchorY="middle"
			position={position}
		>
			{display}
		</Text>
	);
}

type CountdownProps = {
	targetDate: Date;
	position?: Vector3;
	fontSize?: number;
};

export default function Countdown({
	targetDate,
	position = new Vector3(0, 0, 0),
	fontSize = 1,
}: CountdownProps) {
	const [timeLeft, setTimeLeft] = useState({
		days: "00",
		hours: "00",
		minutes: "00",
		seconds: "00",
	});
	const prevTime = useRef(timeLeft);

	// update countdown every second
	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const diff = targetDate.getTime() - now.getTime();
			if (diff <= 0) {
				setTimeLeft({
					days: "00",
					hours: "00",
					minutes: "00",
					seconds: "00",
				});
				return;
			}

			const days = String(
				Math.floor(diff / (1000 * 60 * 60 * 24))
			).padStart(2, "0");
			const hours = String(
				Math.floor((diff / (1000 * 60 * 60)) % 24)
			).padStart(2, "0");
			const minutes = String(
				Math.floor((diff / (1000 * 60)) % 60)
			).padStart(2, "0");
			const seconds = String(Math.floor((diff / 1000) % 60)).padStart(
				2,
				"0"
			);

			setTimeLeft({ days, hours, minutes, seconds });
		}, 1000);

		return () => clearInterval(interval);
	}, [targetDate]);

	useEffect(() => {
		prevTime.current = timeLeft;
	}, [timeLeft]);

	// render a string of digits
	const renderDigits = (unit: string, prevUnit: string, startX: number) =>
		unit
			.split("")
			.map((digit, i) => (
				<CountdownDigit
					key={`${startX}-${i}`}
					digit={digit}
					prev={prevUnit[i]}
					fontSize={fontSize}
					position={new Vector3(startX + i * fontSize * 0.6, 0, 0)}
				/>
			));

	// tightly position units
	const startX = -4;
	const dayX = startX;
	const hourX = dayX + 2.5;
	const minX = hourX + 2.5;
	const secX = minX + 2.5;

	return (
		<group position={position}>
			{renderDigits(timeLeft.days, prevTime.current.days, dayX)}
			{renderDigits(timeLeft.hours, prevTime.current.hours, hourX)}
			{renderDigits(timeLeft.minutes, prevTime.current.minutes, minX)}
			{renderDigits(timeLeft.seconds, prevTime.current.seconds, secX)}
		</group>
	);
}
