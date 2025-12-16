"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: string | null | undefined;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
		this.setState({
			error,
			hasError: true,
			errorInfo: errorInfo.componentStack,
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<section className="bg-transparent">
					<div className="relative z-20 flex flex-col items-center justify-center h-svh  px-4 py-8">
						<div className="w-full max-w-xl bg-black/70 text-white rounded-md p-6 shadow-xl space-y-4">
							<h1 className="text-2xl font-bold text-red-400">
								Something went wrong.
							</h1>

							<p className="text-sm text-white/80">
								An unexpected error occurred. This could be due
								to a bug, a network failure, or unexpected
								input.
							</p>

							{this.state.error?.message && (
								<div className="bg-black border border-red-400 p-4 rounded text-sm font-mono text-white whitespace-pre-wrap">
									<strong className="text-red-300">
										Error:
									</strong>{" "}
									{this.state.error.message}
								</div>
							)}

							{this.state.error?.stack && (
								<div className="max-h-75 overflow-auto bg-zinc-900 p-4 rounded text-xs font-mono whitespace-pre-wrap leading-snug border border-zinc-700 space-y-1">
									<strong className="text-red-300">
										Component Stack:
									</strong>
									<br />
									{this.state.error.stack
										.split("\n")
										.map((line, i) => {
											const trimmed = line
												.trim()
												.replace(/\?t=\d+/, ""); // strip timestamp

											const match =
												trimmed.match(
													/^at (.*?) \((.*?):(\d+):(\d+)\)$/
												) || // at func (file:line:col)
												trimmed.match(/^at (.*)$/) || // at func
												trimmed.match(
													/^(.*?)@(.*?):(\d+):(\d+)$/
												); // func@file:line:col

											if (match) {
												const func = match[1];
												const file = match[2] || "";
												const lineNum = match[3] || "";
												const colNum = match[4] || "";

												// Clean up file paths
												const shortFile = file
													.replace(
														/^http:\/\/localhost:\d+\//,
														""
													)
													.replace(
														/^.*\/node_modules\//,
														"node_modules/"
													);

												return (
													<div
														key={i}
														className="hover:bg-zinc-800/50 px-0 py-0.5 rounded transition"
													>
														<span className="text-blue-400">
															at {func}
														</span>
														{file && (
															<>
																<span className="text-white/50">
																	{" "}
																	(
																</span>
																<span className="text-white/70">
																	{shortFile}
																</span>
																<span className="text-white/50">
																	:
																</span>
																<span className="text-green-400">
																	{lineNum}
																</span>
																<span className="text-white/50">
																	:
																</span>
																<span className="text-yellow-400">
																	{colNum}
																</span>
																<span className="text-white/50">
																	)
																</span>
															</>
														)}
													</div>
												);
											}

											if (trimmed.includes("unknown")) {
												return (
													<div
														key={i}
														className="text-white/30 italic px-2"
													>
														{trimmed}
													</div>
												);
											}

											return (
												<div
													key={i}
													className="text-white/60 px-2"
												>
													{trimmed}
												</div>
											);
										})}
								</div>
							)}

							<div className="flex items-center justify-between mt-4">
								<p className="text-xs text-white/50 italic">
									Check the console for more details if this
									persists.
								</p>
								<p className="text-xs text-white/40">
									Error occurred at{" "}
									{new Date().toLocaleTimeString()}
								</p>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-extralight cursor-pointer transition-all duration-200"
									onClick={() =>
										this.setState({
											hasError: false,
											error: null,
											errorInfo: null,
										})
									}
								>
									Try Again
								</button>
								<button
									type="button"
									className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 rounded text-white text-sm font-extralight cursor-pointer transition-all duration-200"
									onClick={() => window.location.reload()}
								>
									Reload Page
								</button>
							</div>
						</div>
					</div>
				</section>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
