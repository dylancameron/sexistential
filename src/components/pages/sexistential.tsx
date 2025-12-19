"use client";

import { Canvas } from "@react-three/fiber";
import Background from "@/components/Background";
import { SparklerSystem } from "@/components/scene/SparklerSystem";
import { useColorContext } from "@/hooks/useColorContext";
import { useEffect } from "react";
import { SceneComposer } from "../scene/SceneComposer";
import { KonichiwaRecordsLogo } from "../Branding";

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
			<KonichiwaRecordsLogo className="absolute bottom-4 md:bottom-6 right-4 sm:right-6 md:right-12 max-w-18.75 sm:max-w-31.25 md:max-w-37.5" />
		</>
	);
}

export default Sexistential;
