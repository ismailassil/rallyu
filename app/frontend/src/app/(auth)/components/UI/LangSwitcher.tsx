import { getLang, Langs } from "@/app/utils/getLang";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const langs: { lg: Langs; flag: string }[] = [
	{ lg: "en", flag: "🇬🇧" },
	{ lg: "es", flag: "🇪🇸" },
	{ lg: "de", flag: "🇩🇪" },
];

export default function LangSwitcher() {
	const lang = getLang();
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);

		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, []);

	function handleSwitch(lang: Langs) {
		document.cookie = `NEXT_LOCALE_INT=${lang};`;
		router.refresh();
	}

	return (
		<button
			ref={buttonRef}
			onClick={() => setOpen((prev) => !prev)}
			className="relative flex h-13 w-22 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 duration-500 hover:bg-white/5"
		>
			<Globe />
			{lang?.toUpperCase()}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute -bottom-26 left-0 w-22 rounded-lg border border-white/10 bg-white/3 py-1 text-lg *:cursor-pointer *:py-2 *:duration-500 *:hover:bg-white/10"
					>
						{langs.map(({ lg, flag }) => {
							if (lang !== lg) {
								return (
									<p key={lg} onClick={() => handleSwitch(lg)}>
										{flag}&nbsp;&nbsp;{lg.toUpperCase()}
									</p>
								);
							}
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</button>
	);
}
