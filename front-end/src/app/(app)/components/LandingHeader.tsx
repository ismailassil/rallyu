import Link from "next/link";
import Image from "next/image";

export default function LandingHeader() {
	return (
		<header
			className="flex fixed top-0 left-0 w-full h-30
				items-center justify-center sm:justify-normal p-6 pl-16 pr-16"
		>
			<Link href="/">
				<Image
					src="/rallyu-logo.svg"
					alt="Logo"
					width={138}
					height={38}
					priority={true}
					className="hover:cursor-pointer hover:scale-101 transition-transform duration-200"
				></Image>
			</Link>
		</header>
	);
}
