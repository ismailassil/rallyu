import Image from "next/image";

interface InputProps {
	text: string;
	type: string;
	placeholder: string;
	src: string;
	width: number;
	height: number;
	alt: string;
	unique: string;
	// value: string;
	// setValue: (value: string) => void;
}

export default function Input({
	text,
	type,
	unique,
	placeholder,
	src,
	width,
	height,
	alt,
	// value,
	// setValue,
}: InputProps) {
	// function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	const input = e.target.value.replace(/\s+/g, "");
	// 	setValue(input);
	// }

	return (
		<div className="w-full">
			<label htmlFor={type} className="block">
				{text}
			</label>
			<div className="relative">
				<input
					className="w-full h-13 pl-[45px] mt-[7px] bg-bg border-bbg flex items-center justify-center
						gap-[7px] border-2 rounded-lg hover:ring-4 hover:ring-bbg hover:bg-hbbg"
					type={type}
					id={unique}
					name={unique}
					placeholder={placeholder}
					// value={value}
					// onChange={handleChange}
					required
				/>
				<Image
					className="absolute bottom-[16px] left-[15px]"
					src={src}
					alt={alt}
					width={width}
					height={height}
				/>
			</div>
		</div>
	);
}
