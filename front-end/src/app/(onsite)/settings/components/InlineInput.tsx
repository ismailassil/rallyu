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
		<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
			<label className="flex-1 w-full" htmlFor={unique}>
				{label}
			</label>
			<div className="flex-2 w-full">
				<div className="relative">
					<input
						className={`w-full h-11 pl-[45px] bg-bg border-bbg flex items-center justify-center
						gap-[7px] border-2 rounded-lg
						focus:ring-bbg focus:ring-4 outline-none
						${disabled ? "hover:cursor-no-drop" : "hover:ring-4 hover:ring-bbg hover:bg-hbbg"}
						`}
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
