import { Route, Router, Switch } from "wouter";
import Layout from "@/components/Layout";
import Dopamine from "./pages/dopamine";
import Sexistential from "./pages/sexistential";
import { ColorContextProvider } from "./components/context/ColorContextProvider";

function SPARouter() {
	return (
		<ColorContextProvider>
			<Router>
				<Layout>
					<Switch>
						<Route path={"/"} component={Sexistential} />
						<Route path={"/sexistential"} component={Dopamine} />
					</Switch>
				</Layout>
			</Router>
		</ColorContextProvider>
	);
}

export default SPARouter;
