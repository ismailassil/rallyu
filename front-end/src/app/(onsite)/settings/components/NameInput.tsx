import Image from "next/image";

function NameInput({
	orFirstname,
	orLastname,
	firstname,
	lastname,
	handleInputChange,
}: {
	orFirstname: string;
	orLastname: string;
	firstname: string;
	lastname: string;
	handleInputChange: (field: string, value: string) => void;
}) {
	return (
		<div className="flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base">
			<label className="w-full flex-1">Name</label>
			<div className="flex-2 flex w-full gap-3">
				<div className="relative flex-1">
					<input
						className={`bg-bg border-bbg focus:ring-bbg hover:ring-bbg hover:bg-hbbg flex h-11 w-full items-center
										justify-center gap-[7px] rounded-lg border-2 pl-[45px] pr-[10px] outline-none hover:ring-4 focus:ring-4
								`}
						type="text"
						id="firstname"
						name="firstname"
						placeholder={orFirstname}
						autoComplete="off"
						value={firstname}
						onChange={(e) => {
							e.preventDefault();
							handleInputChange("firstname", e.target.value);
						}}
					/>
					<Image
						className="absolute bottom-[13px] left-[15px]"
						src="/firstname.svg"
						alt={"First name" + " Logo"}
						width={19}
						height={19}
					/>
				</div>
				<div className="relative flex-1">
					<input
						className={`bg-bg border-bbg focus:ring-bbg hover:ring-bbg hover:bg-hbbg flex h-11 w-full
										items-center justify-center gap-[7px] rounded-lg border-2 pl-[45px] outline-none hover:ring-4 focus:ring-4
								`}
						type="text"
						id="lastname"
						name="lastname"
						placeholder={orLastname}
						autoComplete="off"
						value={lastname}
						onChange={(e) => {
							e.preventDefault();
							handleInputChange("lastname", e.target.value);
						}}
					/>
					<Image
						className="absolute bottom-[13px] left-[15px]"
						src="/lastname.svg"
						alt={"First name" + " Logo"}
						width={19}
						height={19}
					/>
				</div>
			</div>
		</div>
	);
}

export default NameInput;
