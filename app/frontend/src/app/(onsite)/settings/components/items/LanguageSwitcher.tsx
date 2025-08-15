import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
	const [locale, setLocale] = useState("en");
	const router = useRouter();

	useEffect(() => {
		const cookieLocale = document.cookie
			.split("; ")
			.find((row) => row.startsWith("NEXT_LOCALE="))
			?.split("=")[1];

		const initialLocale = cookieLocale || navigator.language.slice(0, 2) || "en";
		setLocale(initialLocale);
		router.refresh();
	}, [router]);

	function changeLocale(newLocale: string) {
		setLocale(newLocale);
		document.cookie = `NEXT_LOCALE=${newLocale};`;
		router.refresh();
	}

	return (
		<div className="flex h-21 flex-col justify-between gap-4 text-sm lg:text-base">
			<h3 className="w-full flex-1">Language</h3>
			<ul className="bg-card border-br-card top-13 z-10 flex w-full rounded-md border-2 py-1 backdrop-blur-3xl *:mx-1 *:w-full *:cursor-pointer *:rounded-md *:px-4 *:py-1.5 *:text-center *:transition-colors *:duration-300 *:hover:bg-black/30">
				<button
					onClick={(e) => {
						e.preventDefault();
						changeLocale("en");
					}}
					className={`${locale === "en" ? "bg-black/10 ring-2" : "ring-0"} ring-white/30`}
				>
					🇬🇧 <span className="pl-3">English</span>
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						changeLocale("es");
					}}
					className={`${locale === "es" ? "bg-black/10 ring-2" : "ring-0"} ring-white/30`}
				>
					🇪🇸 <span className="pl-3">Spanish</span>
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						changeLocale("de");
					}}
					className={`${locale === "de" ? "bg-black/10 ring-2" : "ring-0"} ring-white/30`}
				>
					🇩🇪 <span className="pl-3">Deutsch</span>
				</button>
			</ul>
		</div>
	);
};

export default LanguageSwitcher;
