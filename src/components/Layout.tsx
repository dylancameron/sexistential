"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import SignUpModal from "./SignUpModal";

interface Props {
	children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<>
			<section className="h-full w-full">{children}</section>
			<Navbar onActionClick={() => setOpen(true)} />
			<SignUpModal open={open} setOpen={setOpen} />
		</>
	);
};

export default Layout;
