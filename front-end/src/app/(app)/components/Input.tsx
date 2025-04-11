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
	value: string;
	setValue: (field: string, value: string) => void;
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
	value,
	setValue,
}: InputProps) {
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const input = e.target.value;
		setValue(unique, input);
	}

	return (
		<div className="w-full">
			<label htmlFor={unique} className="block">
				{text}
			</label>
			<div className="relative">
				<input
					className="w-full h-13 pl-[45px] mt-[7px] bg-bg border-bbg flex items-center justify-center
						gap-[7px] border-2 rounded-lg hover:ring-4 hover:ring-bbg hover:bg-hbbg focus:ring-bbg focus:ring-4 outline-none"
					type={type}
					id={unique}
					name={unique}
					placeholder={placeholder}
					autoComplete="off"
					value={value}
					onChange={(e) => {
						e.preventDefault();
						handleChange(e);
					}}
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
