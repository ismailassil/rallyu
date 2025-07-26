"use client";

import Image from "next/image";
import unicaOne from "./fonts/unicaOne";
import { useRouter } from "next/navigation";

export default function Custom404() {
	const router = useRouter();
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex w-full flex-col items-center overflow-hidden px-10">
				<Image
					src="/meme/fin-awa-ghadi.gif"
					alt="404"
					width={100}
					height={0}
					style={{ width: "auto", height: "auto" }}
					className="mb-10 rounded-lg"
					priority={false}
				/>
				<div className={`${unicaOne.className} text-center`}>
					<h1 className="text-9xl">404!</h1>
					<p className="text-6xl">Not Found</p>
				</div>
				<div
					className="bg-card hover:scale-102 mt-10 rounded-full border-2 border-white/20
						px-6 py-3 transition-transform
						duration-300 hover:cursor-pointer hover:border-white/40"
					onClick={(e) => {
						e.preventDefault();
						router.back();
					}}
				>
					Go back
				</div>
			</div>
		</div>
	);
}
