import { useEffect, useRef, useState } from "react";
import Sparkler, { type SparklerHandle } from "./components/scene/Sparkler";
import { Canvas } from "@react-three/fiber";
import { SceneComposer } from "./components/scene/effects/SceneComposer";
import ColorBlockSidebar from "./components/ColorBlockSidebar";
import VenDiagram from "./components/VenDiagram";
import VenDiagramButtonWrapper from "./components/VenDiagramButtons";

function App() {
	const sparkRef = useRef<SparklerHandle | null>(null);
	const [bgColor, setBgColor] = useState("white");
	const [activeVenn, setActiveVenn] = useState<2 | 3 | null>(null);

	// Derive text color from bgColor
	const textColor = bgColor === "black" ? "white" : "black";

	useEffect(() => {
		document.body.style.backgroundColor = bgColor;
	}, [bgColor]);

	return (
		<>
			<div className="h-dvh">
				<a className="absolute top-12 left-12" href="" rel="" target="">
					<h2 className={`text-${textColor} text-5xl`}>
						sexistential.xyz
					</h2>
				</a>
				<a
					className="absolute top-12 right-12"
					href=""
					rel=""
					target=""
				>
					<h2 className={`text-${textColor} text-5xl`}>sign up</h2>
				</a>
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
				{/* Full-page Venn */}
				{activeVenn && (
					<div className="absolute inset-0 flex items-center justify-center  z-0 pointer-events-none">
						<VenDiagram
							count={activeVenn}
							color={textColor}
							isActive
						/>
					</div>
				)}
				<ColorBlockSidebar changeColor={setBgColor} />
				<VenDiagramButtonWrapper
					borderColor={textColor}
					activeVenn={activeVenn}
					setActiveVenn={setActiveVenn}
				/>
			</div>
		</>
	);
}

export default App;
