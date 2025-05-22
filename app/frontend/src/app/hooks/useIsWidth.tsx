import { useEffect, useState } from "react";

export default function useIsWidth(breakpoint: number) {
	const [isWidth, setIsWidth] = useState(false);

	useEffect(() => {
		function checkScreen() {
			setIsWidth(window.innerWidth < breakpoint);
		}

		checkScreen();

		window.addEventListener("resize", checkScreen);
		return () => window.removeEventListener("resize", checkScreen);
	}, [breakpoint]);

	return isWidth;
}
