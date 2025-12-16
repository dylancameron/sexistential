"use client";

import { useState } from "react";
import VenDiagram from "@/components/VennDiagram";
import VenDiagramButtonWrapper from "@/components/VennDiagramButtons";
import ColorBlockBar from "@/components/ColorBlockBar";

function Dopamine() {
	const [activeVenn, setActiveVenn] = useState<2 | 3>(2);

	return (
		<>
			<div className="h-dvh">
				<ColorBlockBar />
				{activeVenn && (
					<div className="absolute inset-0 z-0 flex items-center justify-center">
						<VenDiagram count={activeVenn} isActive />
					</div>
				)}
				<VenDiagramButtonWrapper
					activeVenn={activeVenn}
					setActiveVenn={setActiveVenn}
				/>
			</div>
		</>
	);
}

export default Dopamine;
