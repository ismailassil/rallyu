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
					width={138}
					height={38}
					priority={true}
					className="hover:scale-101 transition-transform duration-200 hover:cursor-pointer"
				></Image>
			</Link>
		</header>
	);
}
