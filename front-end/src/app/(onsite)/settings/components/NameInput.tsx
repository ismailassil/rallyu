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
		<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
			<label className="flex-1 w-full">Name</label>
			<div className="flex-2 flex gap-3 w-full">
				<div className="relative flex-1">
					<input
						className={`w-full h-11 pl-[45px] pr-[10px] bg-bg border-bbg flex items-center justify-center
										gap-[7px] border-2 rounded-lg focus:ring-bbg focus:ring-4 outline-none hover:ring-4 hover:ring-bbg hover:bg-hbbg
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
						className={`w-full h-11 pl-[45px] bg-bg border-bbg flex items-center justify-center
										gap-[7px] border-2 rounded-lg focus:ring-bbg focus:ring-4 outline-none hover:ring-4 hover:ring-bbg hover:bg-hbbg
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
