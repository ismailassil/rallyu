import Link from "next/link";
import Image from "next/image";

export default function LandingHeader() {
	return (
		<header
			className="h-30 fixed left-0 top-0 flex w-full
				items-center justify-center p-6 pl-16 pr-16 md:justify-normal"
		>
			<Link href="/">
				<Image
					src="/logo/rallyu-logo.svg"
					alt="Logo"
					width={120}
					height={30}
					priority={true}
					className="hover:scale-102 duration-400 transition-all hover:cursor-pointer"
				></Image>
			</Link>
		</header>
	);
}
