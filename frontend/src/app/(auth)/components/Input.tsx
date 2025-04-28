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
					className="h-13 bg-bg border-bbg hover:ring-bbg hover:bg-hbbg focus:ring-bbg mt-[7px] flex w-full
						items-center justify-center gap-[7px] rounded-lg border-2 pl-[45px] outline-none hover:ring-4 focus:ring-4"
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
