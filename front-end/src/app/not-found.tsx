"use client";

import Image from "next/image";
import unicaOne from "./fonts/unicaOne";
import { useRouter } from "next/navigation";

export default function Custom404() {
	const router = useRouter();
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="flex w-full flex-col items-center px-10 overflow-hidden">
				<Image
					src="/fin-awa-ghadi.gif"
					alt="404"
					width={100}
					height={0}
					style={{ width: "auto", height: "auto" }}
					className="rounded-lg mb-10"
					priority={false}
				/>
				<div className={`${unicaOne.className} text-center`}>
					<h1 className="text-9xl">404!</h1>
					<p className="text-6xl">Not Found</p>
				</div>
				<div
					className="mt-10 py-3 px-6 bg-card border-2 border-white/20
						hover:border-white/40 rounded-full"
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
