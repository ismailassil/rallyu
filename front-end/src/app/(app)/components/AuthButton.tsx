import Image from "next/image";

interface AuthButtonProps {
	src: string;
	width: number;
	height: number;
	alt: string;
	text: string;
}

export default function AuthButton({
	src,
	width,
	height,
	alt,
	text,
}: AuthButtonProps) {
	return (
		<button
			className={`h-13 bg-bg border-bbg hover:ring-bbg hover:bg-hbbg hover:border-hbg hover:scale-101 relative flex w-full items-center justify-center gap-[7px] rounded-lg border-2 outline-none transition-transform duration-300 hover:cursor-pointer hover:ring-4`}
		>
			<Image src={src} width={width} height={height} alt={alt}></Image>
			{text}
		</button>
	);
}
