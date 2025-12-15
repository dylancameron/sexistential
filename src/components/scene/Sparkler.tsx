import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import {
	BufferAttribute,
	AdditiveBlending,
	ShaderMaterial,
	Points,
	BufferGeometry,
	DynamicDrawUsage,
	Vector3,
	PointLight,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { fragmentShader, vertexShader } from "@/shaders/sparkler";

type Vec3 = [number, number, number];

export type SparklerHandle = {
	ignite: () => void;
	extinguish: () => void;
};

type SparklerProps = {
	position?: Vec3;
	count?: number;
	color?: string;
	duration?: number;
	autoStart?: boolean;
	spread?: number;
	size?: number;
	gravity?: number;
	onComplete?: () => void;
};

export const Sparkler = forwardRef<SparklerHandle, SparklerProps>(
	(
		{
			position = [0, 0, 0],
			count = 500,
			color = "#ffd66b",
			// duration = 6,
			autoStart = false,
			spread = 1.5,
			size = 12,
			gravity = 9.81,
			onComplete,
		},
		ref
	) => {
		const { camera } = useThree();
		const lightRef = useRef<PointLight | null>(null);

		const positionsArray = useMemo(
			() => new Float32Array(count * 3),
			[count]
		);
		const velocitiesArray = useMemo(
			() => new Float32Array(count * 3),
			[count]
		);
		const agesArray = useMemo(() => new Float32Array(count), [count]);
		const livesArray = useMemo(() => new Float32Array(count), [count]);
		const sizesArray = useMemo(() => new Float32Array(count), [count]);
		const colorsArray = useMemo(() => new Float32Array(count * 3), [count]);

		const positions = useRef(positionsArray);
		const velocities = useRef(velocitiesArray);
		const ages = useRef(agesArray);
		const lives = useRef(livesArray);
		const sizes = useRef(sizesArray);
		const colors = useRef(colorsArray);

		const pointsRef = useRef<Points | null>(null);
		const geometryRef = useRef<BufferGeometry | null>(null);
		const materialRef = useRef<ShaderMaterial | null>(null);

		const burning = useRef<boolean>(autoStart);
		const elapsedSinceIgnite = useRef<number>(0);
		const targetPos = useRef(new Vector3(...position));

		const rand = (a: number, b: number) => a + Math.random() * (b - a);

		const baseColor = useMemo(() => {
			const c = color.replace("#", "");
			const bigint = parseInt(
				c.length === 3
					? c
							.split("")
							.map((ch) => ch + ch)
							.join("")
					: c,
				16
			);
			return [
				((bigint >> 16) & 255) / 255,
				((bigint >> 8) & 255) / 255,
				(bigint & 255) / 255,
			] as [number, number, number];
		}, [color]);

		useEffect(() => {
			for (let i = 0; i < count; i++) {
				const pi = i * 3;
				positions.current[pi] = position[0];
				positions.current[pi + 1] = position[1];
				positions.current[pi + 2] = position[2];

				velocities.current[pi] = 0;
				velocities.current[pi + 1] = 0;
				velocities.current[pi + 2] = 0;

				ages.current[i] = 9999;
				lives.current[i] = 0.0001;
				sizes.current[i] = 0;

				colors.current[pi] = baseColor[0];
				colors.current[pi + 1] = baseColor[1];
				colors.current[pi + 2] = baseColor[2];
			}

			return () => {
				if (geometryRef.current) {
					geometryRef.current.dispose();
					geometryRef.current = null;
				}
			};
		}, [count, position, baseColor]);

		const spawnParticle = (i: number) => {
			const pi = i * 3;
			const pos = targetPos.current;

			positions.current[pi] = pos.x + rand(-0.02, 0.02);
			positions.current[pi + 1] = pos.y + rand(-0.02, 0.02);
			positions.current[pi + 2] = pos.z + rand(-0.02, 0.02);

			const speed = rand(0.8, 1.8) * spread;
			const theta = rand(0, Math.PI * 2);
			const phi = rand(Math.PI * 0.25, Math.PI * 0.45);

			velocities.current[pi] = Math.cos(theta) * Math.sin(phi) * speed;
			velocities.current[pi + 1] = Math.cos(phi) * speed * 1.2;
			velocities.current[pi + 2] =
				Math.sin(theta) * Math.sin(phi) * speed;

			ages.current[i] = 0;
			lives.current[i] = rand(0.3, 0.6);
			sizes.current[i] = size * rand(0.7, 1.0);

			colors.current[pi] = Math.min(1, baseColor[0] + rand(0, 0.15));
			colors.current[pi + 1] = Math.min(1, baseColor[1] + rand(0, 0.15));
			colors.current[pi + 2] = baseColor[2] * rand(0.6, 1);
		};

		useFrame((_, delta) => {
			const slowMo = 0.25; // 25% speed
			const dt = delta * slowMo;

			if (!geometryRef.current) return;

			if (materialRef.current) {
				materialRef.current.uniforms.pixelRatio.value =
					typeof window !== "undefined" ? window.devicePixelRatio : 1;
			}

			if (burning.current) {
				elapsedSinceIgnite.current += dt;
				const spawnRate = Math.max(80, count * 1.0);
				const toSpawn = Math.floor(spawnRate * dt);

				for (let s = 0; s < toSpawn; s++) {
					for (let i = 0; i < count; i++) {
						if (ages.current[i] > lives.current[i]) {
							spawnParticle(i);
							break;
						}
					}
				}
			}

			if (lightRef.current) {
				// Smoothly follow the target position
				lightRef.current.position.lerp(targetPos.current, 0.3);

				// Optional flicker effect for realism
				lightRef.current.intensity = 4 + Math.random() * 2;
			}

			let anyAlive = false;
			for (let i = 0; i < count; i++) {
				ages.current[i] += dt;
				if (ages.current[i] <= lives.current[i]) {
					anyAlive = true;
					const pi = i * 3;

					velocities.current[pi + 1] -= gravity * dt * 0.5;
					positions.current[pi] += velocities.current[pi] * dt;
					positions.current[pi + 1] +=
						velocities.current[pi + 1] * dt;
					positions.current[pi + 2] +=
						velocities.current[pi + 2] * dt;

					velocities.current[pi] *= 0.99;
					velocities.current[pi + 1] *= 0.99;
					velocities.current[pi + 2] *= 0.99;
				}
			}

			const geom = geometryRef.current;
			if (geom) {
				const attributes: [
					keyof BufferGeometry["attributes"],
					Float32Array
				][] = [
					["position", positions.current],
					["velocity", velocities.current],
					["age", ages.current],
					["life", lives.current],
					["psize", sizes.current],
					["pcolor", colors.current],
				];

				attributes.forEach(([attr, arr]) => {
					const buffer = geom.getAttribute(attr) as BufferAttribute;
					buffer.array.set(arr);
					buffer.needsUpdate = true;
				});
			}

			if (
				!burning.current &&
				!anyAlive &&
				elapsedSinceIgnite.current > 0
			) {
				if (onComplete) onComplete();
				elapsedSinceIgnite.current = 0;
			}
		});

		useImperativeHandle(ref, () => ({
			ignite: () => {
				burning.current = true;
				elapsedSinceIgnite.current = 0;
				for (let i = 0; i < Math.min(40, count); i++) {
					const idx = Math.floor(Math.random() * count);
					spawnParticle(idx);
				}
			},
			extinguish: () => {
				burning.current = false;
			},
		}));

		useEffect(() => {
			const handleMouse = (e: MouseEvent) => {
				if (!camera) return;
				// normalized device coords
				const x = (e.clientX / window.innerWidth) * 2 - 1;
				const y = -(e.clientY / window.innerHeight) * 2 + 1;

				// place sparkler 2 units in front of camera
				const vec = new Vector3(x, y, 0.5)
					.unproject(camera)
					.sub(camera.position)
					.normalize()
					.multiplyScalar(2) // distance from camera
					.add(camera.position);

				targetPos.current.lerp(vec, 0.2); // smooth follow
			};
			window.addEventListener("pointermove", handleMouse);
			return () => window.removeEventListener("pointermove", handleMouse);
		}, [camera]);

		useEffect(() => {
			if (autoStart) {
				burning.current = true;
				elapsedSinceIgnite.current = 0;
			}
			return () => {
				burning.current = false;
			};
		}, [autoStart]);

		return (
			<>
				<pointLight
					ref={lightRef}
					color={color}
					intensity={5}
					distance={3}
					decay={1}
				/>
				<points ref={pointsRef} frustumCulled={false}>
					<bufferGeometry ref={geometryRef}>
						<bufferAttribute
							attach="attributes-position"
							args={[positionsArray, 3]}
							usage={DynamicDrawUsage}
						/>
						<bufferAttribute
							attach="attributes-velocity"
							args={[velocitiesArray, 3]}
							usage={DynamicDrawUsage}
						/>
						<bufferAttribute
							attach="attributes-age"
							args={[agesArray, 1]}
							usage={DynamicDrawUsage}
						/>
						<bufferAttribute
							attach="attributes-life"
							args={[livesArray, 1]}
							usage={DynamicDrawUsage}
						/>
						<bufferAttribute
							attach="attributes-psize"
							args={[sizesArray, 1]}
							usage={DynamicDrawUsage}
						/>
						<bufferAttribute
							attach="attributes-pcolor"
							args={[colorsArray, 3]}
							usage={DynamicDrawUsage}
						/>
					</bufferGeometry>
					<shaderMaterial
						ref={materialRef}
						vertexShader={vertexShader}
						fragmentShader={fragmentShader}
						transparent
						depthWrite={false}
						blending={AdditiveBlending}
						vertexColors
						uniforms={{
							sizeAttenuation: { value: 0.85 },
							pixelRatio: {
								value:
									typeof window !== "undefined"
										? window.devicePixelRatio
										: 1,
							},
						}}
					/>
				</points>
			</>
		);
	}
);

export default Sparkler;
