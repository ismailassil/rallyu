import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LangSwitcher from "../(auth)/components/UI/LangSwitcher";
import { useTranslations } from "next-intl";

const LandingPageHeader = () => {
	const [logo, setLogo] = useState(false);
	const router = useRouter();
	const t = useTranslations("landing.buttons");

	return (
		<header className="fixed top-0 left-0 flex h-30 w-full flex-col items-center gap-4 px-16 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
			<Image
				src={!logo ? "/logo/rallyu-logo.svg" : "/logo/rallyu-jp.svg"}
				alt="Logo"
				width={138}
				height={38}
				priority={true}
				className={`cursor-pointer pl-0 transition-transform duration-500 sm:pl-6 ${logo ? "scale-105" : "scale-100"}`}
				onClick={() => setLogo(!logo)}
			/>

			<div className="flex h-13 w-auto justify-between gap-7 *:cursor-pointer *:duration-400 *:hover:scale-102">
				<button
					onClick={() => router.push("/login")}
					className="border-card text-nowrap px-7 flex-1 rounded-md border bg-white/3 ring-white/10 duration-400 hover:scale-102 hover:ring-2"
				>
					{t('login')}
				</button>
				<button
					onClick={() => router.push("/signup")}
					className="bg-main text-nowrap hover:bg-main-hover px-7 flex-1 rounded-md whitespace-nowrap ring-white/10 duration-400 hover:scale-102 hover:ring-2"
					>
					{t('signup')}
				</button>
				<LangSwitcher />
			</div>
		</header>
	);
};

export default LandingPageHeader;
