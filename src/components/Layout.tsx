import React, { useState } from "react";
import Navbar from "./Navbar";
import SignUpModal from "./SignUpModal";
import ColorBlockBar from "./ColorBlockBar";

interface Props {
	children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<>
			<ColorBlockBar />
			<section className="h-full w-full">{children}</section>
			<Navbar onActionClick={() => setOpen(true)} />
			<SignUpModal open={open} setOpen={setOpen} />
		</>
	);
};

export default Layout;
