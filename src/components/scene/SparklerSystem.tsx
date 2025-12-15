import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Points,
	ShaderMaterial,
	Vector3,
} from "three";

interface ParticleData {
	id: number;
	position: Vector3;
	velocity: Vector3;
	life: number;
	maxLife: number;
	size: number;
	isStar: boolean;
	color: Color;
	trail: Vector3[];
}

interface SparklerProps {
	particleCount?: number;
	emissionRate?: number;
	origin?: [number, number, number];
	trailLength?: number;
	slowMo?: number;
}

const SparklerSystem: React.FC<SparklerProps> = ({
	particleCount = 150,
	emissionRate = 5,
	origin = [1, -1, 0],
	trailLength = 50,
	slowMo = 0.75,
}) => {
	const particlesRef = useRef<ParticleData[]>([]);
	const pointsRef = useRef<Points>(null);
	const nextId = useRef(0);
	const spawnTimer = useRef(0);

	const colors = useMemo(
		() => [
			new Color(1.0, 1.0, 0.9), // Bright white
			new Color(1.0, 1.0, 0.8),
			new Color(1.0, 0.8, 0.7),
			new Color(1.0, 0.9, 0.7),
		],
		[]
	);

	const geometry = useMemo(() => {
		const geo = new BufferGeometry();
		const totalPoints = particleCount * trailLength; // trail points
		geo.setAttribute(
			"position",
			new BufferAttribute(new Float32Array(totalPoints * 3), 3)
		);
		geo.setAttribute(
			"size",
			new BufferAttribute(new Float32Array(totalPoints), 1)
		);
		geo.setAttribute(
			"alpha",
			new BufferAttribute(new Float32Array(totalPoints), 1)
		);
		geo.setAttribute(
			"color",
			new BufferAttribute(new Float32Array(totalPoints * 3), 3)
		);
		return geo;
	}, [particleCount, trailLength]);

	const material = useMemo(() => {
		return new ShaderMaterial({
			uniforms: {},
			vertexShader: `
				attribute float size;
				attribute float alpha;
				attribute vec3 color;
				varying float vAlpha;
				varying vec3 vColor;
				void main() {
					vAlpha = alpha;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					gl_PointSize = size * (250.0 / -mvPosition.z);
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				varying float vAlpha;
				varying vec3 vColor;
				void main() {
					vec2 center = gl_PointCoord - vec2(0.5);
					float dist = length(center);

					// Sharper cutoff
					if (dist > 0.35) discard; // smaller radius -> sharper edges

					// Edge Softness
					float alpha = vAlpha * (1.0 - smoothstep(0.0, 0.35, dist));
					
					float brightness = 1.0 - smoothstep(0.0, 0.15, dist);
					vec3 color = vColor + vec3(brightness * 0.8);

					gl_FragColor = vec4(color, alpha);
				}
			`,
			blending: AdditiveBlending,
			depthWrite: false,
			transparent: true,
		});
	}, []);

	useFrame((_state, delta) => {
		delta *= slowMo;

		const positions = geometry.attributes.position.array as Float32Array;
		const sizes = geometry.attributes.size.array as Float32Array;
		const alphas = geometry.attributes.alpha.array as Float32Array;
		const colorsArray = geometry.attributes.color.array as Float32Array;

		// Spawn new particles
		spawnTimer.current += delta;
		const spawnCount = Math.floor(spawnTimer.current * emissionRate * 10);
		if (spawnCount > 0) {
			spawnTimer.current = 0;
			for (let i = 0; i < spawnCount; i++) {
				if (particlesRef.current.length < particleCount) {
					const theta = Math.random() * Math.PI * 2; // around Y
					const phi = Math.random() * Math.PI * 0.8 + Math.PI * 0.3; // cone shape
					const speed = Math.random() * 2 + 0.5;
					const velocity = new Vector3(
						Math.sin(phi) * Math.cos(theta) * speed,
						Math.cos(phi) * speed + Math.random() * 0.5,
						Math.sin(phi) * Math.sin(theta) * speed
					);
					const colorIndex = Math.floor(
						Math.random() * colors.length
					);
					particlesRef.current.push({
						id: nextId.current++,
						position: new Vector3(...origin),
						velocity,
						life: 0,
						maxLife: Math.random() * 0.4 + 0.3,
						size: Math.random() * 3 + 4,
						color: colors[colorIndex].clone(),
						isStar: Math.random() > 0.5,
						trail: Array(trailLength).fill(new Vector3(...origin)),
					});
				}
			}
		}

		// Update particles
		particlesRef.current = particlesRef.current.filter((p, i) => {
			p.life += delta;
			if (i >= particleCount) return false;

			p.velocity.y -= delta * 9.8 * 0.15;
			p.position.addScaledVector(p.velocity, delta);

			// Update trail
			p.trail.unshift(p.position.clone());
			if (p.trail.length > trailLength) p.trail.pop();

			for (let t = 0; t < p.trail.length; t++) {
				const idx = (i * trailLength + t) * 3;
				positions[idx] = p.trail[t].x;
				positions[idx + 1] = p.trail[t].y;
				positions[idx + 2] = p.trail[t].z;

				sizes[i * trailLength + t] =
					p.size * (1 - (t / trailLength) * 0.2);
				alphas[i * trailLength + t] =
					(1 - p.life / p.maxLife) * (1 - t / trailLength);
				colorsArray[idx] = p.color.r;
				colorsArray[idx + 1] = p.color.g;
				colorsArray[idx + 2] = p.color.b;
			}

			return p.life < p.maxLife;
		});

		// Clear unused
		for (let i = particlesRef.current.length; i < particleCount; i++) {
			for (let t = 0; t < trailLength; t++) {
				const idx = (i * trailLength + t) * 3;
				// eslint-disable-next-line react-hooks/immutability
				positions[idx] = 0;
				positions[idx + 1] = 0;
				positions[idx + 2] = 0;
				sizes[i * trailLength + t] = 0;
				alphas[i * trailLength + t] = 0;
			}
		}

		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.size.needsUpdate = true;
		geometry.attributes.alpha.needsUpdate = true;
		geometry.attributes.color.needsUpdate = true;
	});

	return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export { SparklerSystem };
