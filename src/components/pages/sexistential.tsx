"use client";

import { Canvas } from "@react-three/fiber";
import CountdownComponent from "@/components/Countdown";
import Background from "@/components/Background";
import { SparklerSystem } from "@/components/scene/SparklerSystem";
import { useColorContext } from "@/hooks/useColorContext";
import { useEffect } from "react";

function Sexistential() {
	const { setOverrideTextColor } = useColorContext();

	useEffect(() => {
		setOverrideTextColor("#fff");
		return () => setOverrideTextColor(undefined);
	}, [setOverrideTextColor]);

	return (
		<>
			<Background className="h-dvh w-full max-w-full">
				<Canvas
					camera={{ position: [0, 0, 6], fov: 50 }}
					gl={{
						antialias: true,
						alpha: true,
						powerPreference: "high-performance",
					}}
				>
					<ambientLight intensity={0.1} />
					<SparklerSystem particleCount={150} emissionRate={20} />
				</Canvas>
				<CountdownComponent
					targetDate={new Date("2026-01-07T00:00:00")}
				/>
			</Background>
		</>
	);
}

export default Sexistential;
