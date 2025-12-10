import {
	EffectComposer,
	Bloom,
	DepthOfField,
	Noise,
	Vignette,
} from "@react-three/postprocessing";

export function SceneComposer() {
	return (
		<>
			<EffectComposer>
				<DepthOfField
					focusDistance={0}
					focalLength={0.02}
					bokehScale={2}
					height={480}
				/>
				<Bloom
					luminanceThreshold={0.4}
					luminanceSmoothing={0.9}
					height={600}
				/>
				<Noise opacity={0.1} />
				<Vignette eskil={false} offset={0.1} darkness={1.1} />
			</EffectComposer>
		</>
	);
}
