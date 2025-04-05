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
			className={`relative w-full h-13 bg-bg border-bbg outline-none flex items-center justify-center gap-[7px] border-2 rounded-lg hover:cursor-pointer hover:ring-4 hover:ring-bbg hover:bg-hbbg hover:border-hbg`}
		>
			<Image src={src} width={width} height={height} alt={alt}></Image>
			{text}
		</button>
	);
}
