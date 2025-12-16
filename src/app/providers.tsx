"use client";

import React, { Suspense } from "react";
import { ColorContextProvider } from "@/components/context/ColorContextProvider";
import { Spinner } from "@/components/ui/spinner";
import ErrorBoundary from "./error";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<ErrorBoundary>
			<ColorContextProvider>
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-dvh">
							<Spinner />
						</div>
					}
				>
					{children}
				</Suspense>
			</ColorContextProvider>
		</ErrorBoundary>
	);
};

export default Providers;
