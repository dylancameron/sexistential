import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import SPARouter from "./router";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<SPARouter />
	</StrictMode>
);
