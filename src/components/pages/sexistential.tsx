"use client";

import { Canvas } from "@react-three/fiber";
import Background from "@/components/Background";
import { SparklerSystem } from "@/components/scene/SparklerSystem";
import { useColorContext } from "@/hooks/useColorContext";
import { useEffect } from "react";
import { SceneComposer } from "../scene/SceneComposer";

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
					<SparklerSystem
						followCursor
						particleCount={100}
						emissionRate={20}
					/>
					<SceneComposer />
				</Canvas>
			</Background>
		</>
	);
}

export default Sexistential;
