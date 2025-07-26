import Image from "next/image";

type InlineInputProps = {
	label: string;
	disabled?: boolean;
	unique: string;
	type?: string;
	value: string;
	setValue?: (field: string, value: string) => void;
	icon: string;
	original_value?: string;
};

function InlineInput({
	label,
	disabled = false,
	unique,
	type,
	value,
	setValue,
	icon,
	original_value,
}: InlineInputProps) {
	function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		if (setValue) setValue(unique, e.target.value);
	}

	return (
		<div className="flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base">
			<label className="w-full flex-1" htmlFor={unique}>
				{label}
			</label>
			<div className="flex-2 w-full">
				<div className="relative">
					<input
						className={`bg-bg border-bbg focus:ring-bbg flex h-11 w-full items-center justify-center gap-[7px]
							rounded-lg border-2 pl-[45px]
							pr-[10px] outline-none focus:ring-4
							${disabled ? "hover:cursor-no-drop" : "hover:ring-bbg hover:bg-hbbg hover:ring-4"} `}
						type={type}
						id={unique}
						name={unique}
						placeholder={original_value}
						autoComplete="off"
						value={value}
						onChange={handleInput}
						disabled={disabled}
					/>
					<Image
						className="absolute bottom-[13px] left-[15px]"
						src={icon}
						alt={icon + " Logo"}
						width={19}
						height={19}
					/>
				</div>
			</div>
		</div>
	);
}

export default InlineInput;
