import { useRef } from "react";
import Sparkler, { type SparklerHandle } from "@/components/scene/Sparkler";
import { Canvas } from "@react-three/fiber";
import { SceneComposer } from "@/components/scene/effects/SceneComposer";

function Sexistential() {
	const sparkRef = useRef<SparklerHandle | null>(null);

	return (
		<>
			<div className="h-dvh">
				<Canvas className="bg-transparent">
					<pointLight position={[0, 0, 1]} intensity={1} />
					<Sparkler
						ref={sparkRef}
						position={[0, 0, 0]}
						count={500}
						color="#ffd66b"
						autoStart={true}
						spread={0.94}
						size={12}
						gravity={9.81 / 1.25}
					/>
					<SceneComposer />
				</Canvas>
			</div>
		</>
	);
}

export default Sexistential;
