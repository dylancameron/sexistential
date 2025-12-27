"use client";

import { Canvas } from "@react-three/fiber";
import Background from "@/components/Background";
import { SparklerSystem } from "@/components/scene/SparklerSystem";
import { useColorContext } from "@/hooks/useColorContext";
import { useEffect } from "react";
import { SceneComposer } from "../scene/SceneComposer";
import { KonichiwaRecordsLogo } from "../Branding";
import Link from "next/link";

function Sexistential() {
	const { setOverrideTextColor, setOverrideBackgroundColor } =
		useColorContext();

	useEffect(() => {
		setOverrideTextColor("#fff");
		setOverrideBackgroundColor("#000");
		return () => {
			setOverrideTextColor(undefined);
			setOverrideBackgroundColor(undefined);
		};
	}, [setOverrideTextColor, setOverrideBackgroundColor]);

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
			<Link
				href="https://robyn.com"
				target="_blank"
				rel="noopener noreferrer"
			>
				<KonichiwaRecordsLogo className="absolute bottom-1 md:bottom-6 right-0 sm:right-6 md:right-6 max-w-16 sm:max-w-20 md:max-w-24" />
			</Link>
		</>
	);
}

export default Sexistential;
