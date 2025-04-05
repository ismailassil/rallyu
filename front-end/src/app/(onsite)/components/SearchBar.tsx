import lora from "@/app/fonts/lora";
import Image from "next/image";

// interface InputProps {
// text: string;
// type: string;
// placeholder: string;
// src: string;
// width: number;
// height: number;
// alt: string;
// unique: string;
// value: string;
// setValue: (value: string) => void;
// }

export default function SearchBar() {
	// function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	const input = e.target.value.replace(/\s+/g, "");
	// 	setValue(input);
	// }

	return (
		<div
			className="flex items-center bg-card h-[55px] w-[100px] rounded-full
			justify-center pr-1 hover:cursor-pointer hover:ring-2 hover:ring-white/30
			duration-200 animation-transform hover:scale-105
			"
		>
			{/* <input
					className="w-[460px] h-13 pl-[59px] bg-bg border-bbg flex items-center justify-center
						gap-[7px] border-2 rounded-full hover:ring-4 hover:ring-bbg hover:bg-hbbg"
					type="text"
					id="search"
					name="search"
					required
				/> */}
			<Image
				className="mr-3"
				src="/search.svg"
				alt="Search Logo"
				width={0}
				height={0}
				style={{ width: "auto", height: "auto" }}
			/>
			<Image src="/command.svg" alt="Command Logo" width={17} height={17} />
			<span className={`text-xl ${lora.className}`}>K</span>
		</div>
	);
}
