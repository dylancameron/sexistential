"use client";

import React, {
	useRef,
	useMemo,
	useEffect,
	useState,
	useCallback,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
	hasExploded?: boolean;
	isBurst?: boolean;
	tipFlash?: number; // 0..1, decays fast
}

interface SparklerProps {
	particleCount?: number;
	emissionRate?: number;
	origin?: [number, number, number];
	trailLength?: number;
	slowMo?: number;
	scale?: number;
	autoScale?: boolean;
	followCursor?: boolean;
	cursorWorld?: React.RefObject<Vector3>;
}

const SECONDARY_BURST_CHANCE = 0.015; // per frame, feels organic
// const SECONDARY_SPARK_COUNT = [2, 5];
const SECONDARY_LIFE = [0.15, 0.3];
const SECONDARY_SPEED = [1.2, 2.2];

const SparklerSystem: React.FC<SparklerProps> = ({
	particleCount = 150,
	emissionRate = 3,
	origin = [1.5, -1, 0],
	trailLength = 50,
	slowMo = 0.85,
	scale = 1.5,
	autoScale = true,
	followCursor = false,
	cursorWorld: externalCursorRef,
}) => {
	const particlesRef = useRef<ParticleData[]>([]);
	const pointsRef = useRef<Points>(null);
	const nextId = useRef(0);
	const spawnTimer = useRef(0);
	const [deviceScale, setDeviceScale] = useState(1);
	const [adjustedOrigin, setAdjustedOrigin] =
		useState<[number, number, number]>(origin);

	const { camera, size } = useThree();

	const internalCursor = useRef(new Vector3());
	const cursorWorld = externalCursorRef || internalCursor;
	const prevCursor = useRef(cursorWorld.current.clone());
	const cursorSpeed = useRef(0);
	const isDesktop = useRef(true);

	useEffect(() => {
		isDesktop.current = !window.matchMedia("(pointer: coarse)").matches;
		if (!followCursor || !isDesktop.current) return;

		const handleMouseMove = (e: MouseEvent) => {
			// NDC
			const ndc = new Vector3(
				(e.clientX / size.width) * 2 - 1,
				-(e.clientY / size.height) * 2 + 1,
				0.5
			);

			// World space ray
			const worldPoint = ndc.unproject(camera);
			const dir = worldPoint.sub(camera.position).normalize();

			// Intersect with z = 0 plane
			const t = -camera.position.z / dir.z;
			cursorWorld.current.copy(
				camera.position.clone().add(dir.multiplyScalar(t))
			);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [followCursor, camera, size, cursorWorld]);

	// Memoize the update function to prevent unnecessary re-renders
	const updateScaleAndOrigin = useCallback(() => {
		if (!autoScale) {
			setDeviceScale(1);
			setAdjustedOrigin(origin);
			return;
		}

		const width = window.innerWidth;
		const height = window.innerHeight;
		const isMobile = width < 768;
		const isTablet = width >= 768 && width < 1024;
		const aspectRatio = width / height;

		// Calculate scale based on screen size
		let calculatedScale = 1;

		if (isMobile) {
			// Mobile: scale based on screen width
			calculatedScale = Math.min(width / 375, 1); // 375px is base mobile width
			calculatedScale *= 1.1;
		} else if (isTablet) {
			calculatedScale = 1;
		}

		// Also consider aspect ratio
		if (aspectRatio < 0.75) {
			// Very tall/narrow screens (portrait phones)
			calculatedScale *= 1.3;
		}

		// Adjust origin position for mobile/tablet screens
		let newOrigin: [number, number, number] = [...origin];

		if (isMobile) {
			// Adjust X position to stay within viewport
			// Use percentage of screen width instead of fixed values
			const maxX = width < 400 ? 0.9 : 1.2; // Smaller max X for very small screens
			const newX = Math.min(origin[0], maxX + (width - 375) / 1000);

			// Adjust Y position to be higher on mobile to avoid bottom of screen
			const newY = Math.max(origin[1], -2); // Raise the minimum Y position

			// For portrait phones, adjust further
			if (aspectRatio < 0.75) {
				const portraitX = newX * 0.8; // Move more to center for narrow screens
				const portraitY = Math.max(newY, -2); // Raise even higher
				newOrigin = [portraitX, portraitY, origin[2]];
			} else {
				newOrigin = [newX, newY, origin[2]];
			}
		} else if (isTablet) {
			// Adjust for tablet screens
			const tabletX = origin[0] * 0.9;
			const tabletY = Math.max(origin[1], -0.8);
			newOrigin = [tabletX, tabletY, origin[2]];
		}

		// Only update state if values actually changed
		setDeviceScale((prevScale) => {
			if (Math.abs(prevScale - calculatedScale) < 0.01) return prevScale;
			return calculatedScale;
		});

		setAdjustedOrigin((prevOrigin) => {
			if (
				Math.abs(prevOrigin[0] - newOrigin[0]) < 0.01 &&
				Math.abs(prevOrigin[1] - newOrigin[1]) < 0.01 &&
				Math.abs(prevOrigin[2] - newOrigin[2]) < 0.01
			) {
				return prevOrigin;
			}
			return newOrigin;
		});
	}, [autoScale, origin]);

	// Detect device and adjust origin position - only on mount and resize
	useEffect(() => {
		// Initial calculation
		updateScaleAndOrigin();

		// Debounced resize handler to prevent excessive updates
		let resizeTimeout: NodeJS.Timeout;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(updateScaleAndOrigin, 150);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimeout);
		};
	}, [updateScaleAndOrigin]); // Only depend on the memoized callback

	const effectiveScale = autoScale ? deviceScale * scale : scale;

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
		const totalPoints = particleCount * trailLength;
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
				precision highp float;
				attribute float size;
				attribute float alpha;
				attribute vec3 color;
				varying float vAlpha;
				varying vec3 vColor;
				void main() {
					vAlpha = alpha;
					vColor = color;
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

					gl_PointSize = size * (50.0 / -mvPosition.z);
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				precision highp float;
				varying float vAlpha;
				varying vec3 vColor;
				void main() {
					vec2 center = gl_PointCoord - vec2(0.5);
					float dist = length(center);

					if (dist > 0.35) discard;

					float alpha = vAlpha * (1.0 - smoothstep(0.0, 0.3, dist));
					
					float brightness = 1.0 - smoothstep(0.0, 0.05, dist);
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
		// Clamp delta to prevent huge jumps
		delta = Math.min(delta, 0.1) * slowMo;

		const positions = geometry.attributes.position.array as Float32Array;
		const sizes = geometry.attributes.size.array as Float32Array;
		const alphas = geometry.attributes.alpha.array as Float32Array;
		const colorsArray = geometry.attributes.color.array as Float32Array;

		if (followCursor && isDesktop.current) {
			const deltaPos = cursorWorld.current
				.clone()
				.sub(prevCursor.current);
			cursorSpeed.current = deltaPos.length() / delta; // approximate speed
			prevCursor.current.copy(cursorWorld.current);

			// Smoothly move origin toward cursor
			// eslint-disable-next-line react-hooks/immutability
			adjustedOrigin[0] +=
				(cursorWorld.current.x - adjustedOrigin[0]) * 0.18;
			adjustedOrigin[1] +=
				(cursorWorld.current.y - adjustedOrigin[1]) * 0.18;
		}
		const speedFactor = Math.max(0, 1 - cursorSpeed.current * 0.5);

		// Spawn new particles
		spawnTimer.current += delta;
		const spawnCount = Math.floor(
			spawnTimer.current * emissionRate * 6 * speedFactor
		);

		if (spawnCount > 0) {
			spawnTimer.current = 0;
			for (let i = 0; i < spawnCount; i++) {
				if (particlesRef.current.length < particleCount) {
					const theta = Math.random() * Math.PI * 2;
					const phi = Math.random() * Math.PI * 0.8 + Math.PI * 0.3;
					const speed =
						(Math.random() * 1.2 + 0.3) *
						effectiveScale *
						speedFactor;

					const velocity = new Vector3(
						Math.sin(phi) * Math.cos(theta) * speed,
						Math.cos(phi) * speed +
							Math.random() * 0.5 * effectiveScale,
						Math.sin(phi) * Math.sin(theta) * speed
					);
					const colorIndex = Math.floor(
						Math.random() * colors.length
					);
					particlesRef.current.push({
						id: nextId.current++,
						position: new Vector3(...adjustedOrigin), // Use adjusted origin
						velocity,
						life: 0,
						maxLife: Math.random() * 0.4 + 0.3,
						size: (Math.random() * 3 + 4) * effectiveScale,
						color: colors[colorIndex].clone(),
						isStar: Math.random() > 0.5,
						trail: Array(trailLength).fill(
							new Vector3(...adjustedOrigin)
						),
					});
				}
			}
		}

		// Update particles
		particlesRef.current = particlesRef.current.filter((p, i) => {
			p.life += delta;
			if (p.tipFlash !== undefined) {
				p.tipFlash -= delta * 18.0 * (0.5 + 0.5 * speedFactor);
				if (p.tipFlash < 0) p.tipFlash = 0;
			}

			if (i >= particleCount) return false;

			const trailTip = p.trail[0]?.clone() ?? p.position.clone();
			// Secondary burst logic
			if (
				!p.hasExploded &&
				p.life > p.maxLife * 0.25 &&
				Math.random() < SECONDARY_BURST_CHANCE
			) {
				p.hasExploded = true;

				p.tipFlash = 1.0; // Start tip flash

				const burstCount = Math.floor(Math.random() * 2 + 1);

				for (let b = 0; b < burstCount; b++) {
					if (particlesRef.current.length >= particleCount) break;

					const dir = p.velocity
						.clone()
						.normalize()
						.multiplyScalar(0.7)
						.add(
							new Vector3(
								Math.random() - 0.5,
								Math.random() - 0.2,
								Math.random() - 0.5
							)
						)
						.normalize();

					const speed =
						(Math.random() *
							(SECONDARY_SPEED[1] - SECONDARY_SPEED[0]) +
							SECONDARY_SPEED[0]) *
						effectiveScale;

					const hotColor = p.color
						.clone()
						.lerp(new Color(1.0, 1.0, 0.9), 0.6);

					const childTrailLength = Math.max(
						6,
						Math.floor(trailLength * 0.15)
					);

					particlesRef.current.push({
						id: nextId.current++,
						position: trailTip.clone(),
						velocity: dir.multiplyScalar(speed),
						life: 0,
						maxLife:
							Math.random() *
								(SECONDARY_LIFE[1] - SECONDARY_LIFE[0]) +
							SECONDARY_LIFE[0],
						size: (Math.random() * 2 + 2) * effectiveScale,
						color: hotColor,
						isStar: false,
						trail: Array(childTrailLength).fill(trailTip.clone()),
					});
				}
			}

			p.velocity.y -= delta * 9.8 * 0.25;
			p.position.addScaledVector(p.velocity, delta);

			// Update trail
			p.trail.unshift(p.position.clone());
			if (p.trail.length > trailLength) p.trail.pop();

			const baseIdx = i * trailLength * 3;

			positions[baseIdx] = trailTip.x;
			positions[baseIdx + 1] = trailTip.y;
			positions[baseIdx + 2] = trailTip.z;

			const flash = p.tipFlash ?? 0;

			sizes[i * trailLength] = p.size * (1.0 + flash * 1.5);

			alphas[i * trailLength] = 1 - p.life / p.maxLife + flash;

			colorsArray[baseIdx] = 1.0;
			colorsArray[baseIdx + 1] = 1.0;
			colorsArray[baseIdx + 2] = 1.0;

			for (let t = 1; t < p.trail.length; t++) {
				const idx = (i * trailLength + t) * 3;

				positions[idx] = p.trail[t].x;
				positions[idx + 1] = p.trail[t].y;
				positions[idx + 2] = p.trail[t].z;

				sizes[i * trailLength + t] =
					p.size * (1 - (t / trailLength) * 0.25);

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
