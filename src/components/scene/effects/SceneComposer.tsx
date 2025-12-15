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
					focalLength={0.1}
					bokehScale={1}
					height={600}
				/>
				<Bloom
					luminanceThreshold={0.1}
					luminanceSmoothing={0.3}
					height={600}
				/>
				<Noise opacity={0.5} />
				<Vignette eskil={false} offset={0.1} darkness={1.1} />
			</EffectComposer>
		</>
	);
}
