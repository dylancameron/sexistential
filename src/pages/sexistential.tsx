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
			<Background className="h-dvh">
				<Canvas
					className="bg-transparent absolute inset-0 z-10"
					camera={{ position: [0, 0, 6], fov: 50 }}
				>
					<ambientLight intensity={0.1} />
					<SparklerSystem particleCount={500} emissionRate={10} />
				</Canvas>
				<CountdownComponent
					targetDate={new Date("2026-01-07T00:00:00")}
				/>
			</Background>
		</>
	);
}

export default Sexistential;
