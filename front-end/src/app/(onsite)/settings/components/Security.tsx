import passwordValidator from "@/app/(signup-background)/passwordValidator";
import { Check, Key, ShieldCheck } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";
import PushNotification from "../../components/PushNotification";
import { motion } from "framer-motion";

enum PasswordError {
	TooShort = 1,
	MissingNumber,
	MissingUpperCase,
	MissingLowerCase,
	MissingSpecial,
	Success = 0,
}

const ErrorMessages: Record<PasswordError, string> = {
	[PasswordError.TooShort]: "Password is too short. Minimum length is 8 characters.",
	[PasswordError.MissingNumber]: "Password must include at least one number.",
	[PasswordError.MissingUpperCase]: "Password must include at least one uppercase letter.",
	[PasswordError.MissingLowerCase]: "Password must include at least one lowercase letter.",
	[PasswordError.MissingSpecial]: "Password must include at least one special character.",
	[PasswordError.Success]: "",
};

function Security() {
	const [oldpassword, setOldpassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState("");
	const [twofa, setTwofa] = useState<number>();
	const [popup, setPopup] = useState(-1);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [deletion, setDeletion] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [anonymizes, setAnonymizes] = useState(false);

	function handleTwoFa() {
		// twofa
	}

	function handleSubmit() {
		if (!oldpassword || oldpassword.trim().length === 0) {
			setError("Old password is required");
			return;
		}
		if (!newPassword || newPassword.trim().length === 0) {
			setError("New password is required");
			return;
		}

		const validationResult = passwordValidator(newPassword);
		if (validationResult !== PasswordError.Success) {
			switch (validationResult) {
				case PasswordError.TooShort:
					setError(ErrorMessages[PasswordError.TooShort]);
					break;
				case PasswordError.MissingNumber:
					setError(ErrorMessages[PasswordError.MissingNumber]);
					break;
				case PasswordError.MissingUpperCase:
					setError(ErrorMessages[PasswordError.MissingUpperCase]);
					break;
				case PasswordError.MissingLowerCase:
					setError(ErrorMessages[PasswordError.MissingLowerCase]);
					break;
				case PasswordError.MissingSpecial:
					setError(ErrorMessages[PasswordError.MissingSpecial]);
					break;
				default:
					setError("Invalid password.");
			}
			return;
		}

		setError("");
	}

	return (
		<motion.div
			className="max-w-220 hide-scrollbar flex h-full w-full flex-col gap-3 overflow-y-scroll p-4"
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 50 }}
			transition={{ type: "spring", stiffness: 120 }}
		>
			<div>
				<h2 className="mb-1 mt-2 text-xl font-semibold lg:text-2xl">Basics</h2>
				<hr className="border-white/10" />
			</div>
			<div className="flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base">
				<label className="w-full flex-1">
					Change Password
					{error && <p className="text-xs text-red-400">{error}</p>}
				</label>
				<div className="flex-2 flex w-full gap-3">
					<div className="relative flex-1">
						<input
							className={`bg-bg border-bbg focus:ring-bbg hover:ring-bbg hover:bg-hbbg flex h-11 w-full items-center
										justify-center gap-[7px] rounded-lg border-2 pl-[45px] pr-[10px] outline-none hover:ring-4 focus:ring-4
								`}
							type="password"
							id="oldpassword"
							name="oldpassword"
							placeholder="Old password"
							autoComplete="off"
							value={oldpassword}
							onChange={(e) => {
								e.preventDefault();
								setOldpassword(e.target.value);
							}}
						/>
						<Image
							className="absolute bottom-[13px] left-[15px]"
							src="/lock.svg"
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
							type="password"
							id="newpassowrd"
							name="newpassowrd"
							placeholder="New password"
							autoComplete="off"
							value={newPassword}
							onChange={(e) => {
								e.preventDefault();
								setNewPassword(e.target.value);
							}}
						/>
						<Image
							className="absolute bottom-[13px] left-[15px]"
							src="/lock.svg"
							alt={"First name" + " Logo"}
							width={19}
							height={19}
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-end">
				<button
					className="bg-main hover:scale-101 mt-3 flex transform items-center gap-4
										rounded-sm px-4 py-2 text-sm
										transition-all duration-300 hover:cursor-pointer lg:text-base"
					onClick={handleSubmit}
				>
					<Check size={22} />
					<p>Update Password</p>
				</button>
			</div>
			<div className="mt-5">
				<h2 className="mb-1 mt-2 text-xl font-semibold lg:text-2xl">Two-factor authentication</h2>
				<hr className="border-white/10" />
			</div>
			<div className="flex flex-col gap-5 text-sm md:flex-row lg:gap-10 lg:text-base">
				<div className="flex gap-6">
					<div className="flex h-[110px] w-[110px] items-center justify-center rounded-md bg-white">
						<Image src="/qr.png" alt="2FA Qr-Code" width={95} height={95} />
					</div>
					<div className="max-w-80 flex flex-col justify-between gap-2">
						<label htmlFor="2fa" className="text-gray-400">
							Enter the 6-digit code from your authenticator app
						</label>
						<div className="relative">
							<input
								type="number"
								className={`bg-bg border-bbg focus:ring-bbg hover:ring-bbg hover:bg-hbbg flex h-11 w-full items-center
								justify-center gap-[7px] rounded-lg border-2 pl-[45px] pr-[10px] outline-none hover:ring-4 focus:ring-4
								`}
								name="2fa"
								placeholder="&#x2022; &#x2022; &#x2022; &#x2022; &#x2022; &#x2022;"
								value={twofa === undefined ? "" : twofa}
								onChange={(e) => {
									e.preventDefault();
									const inputValue = e.target.value;
									if (inputValue.length <= 6) setTwofa(Number(inputValue));
								}}
							/>
							<Key size={20} className="absolute bottom-[13px] left-[15px]" />
						</div>
					</div>
				</div>
				<div className="flex h-full flex-1 items-end justify-end">
					<button
						className="bg-main hover:scale-101 mt-3 flex transform items-center gap-4
										rounded-sm px-8 py-2.5 text-sm
										transition-all duration-300 hover:cursor-pointer lg:text-base"
						onClick={handleTwoFa}
					>
						<ShieldCheck size={22} />
						<p>Enable 2FA</p>
					</button>
				</div>
			</div>
			<div className="mt-5">
				<h2 className="mb-1 mt-2 text-xl font-semibold lg:text-2xl">Be Caution</h2>
				<hr className="border-white/10" />
			</div>
			<button
				className="hover:bg-white/2 hover:scale-101 flex transform flex-col rounded-md px-5 py-4
						text-left ring-1 ring-white/20 transition-all duration-300 hover:cursor-pointer hover:ring-2 hover:ring-white/20"
				onClick={(e) => {
					e.preventDefault();
					setPopup(0);
				}}
			>
				<h3 className="text-sm font-bold lg:text-base">Delete Account</h3>
				<p className="text-sm font-light text-gray-400 lg:text-base">
					This will permanently delete your account and all associated data. Action is final.
				</p>
			</button>
			<button
				className="hover:bg-white/2 hover:scale-101 flex transform flex-col rounded-md px-5 py-4
						text-left ring-1 ring-white/20 transition-all duration-300 hover:cursor-pointer hover:ring-2 hover:ring-white/20"
				onClick={(e) => {
					e.preventDefault();
					setPopup(1);
				}}
			>
				<h3 className="text-sm font-bold lg:text-base">Anonymizes your personal data</h3>
				<p className="text-sm font-light text-gray-400 lg:text-base">
					Your personal information will be anonymized to prevent identification or tracking.
				</p>
			</button>
			<PushNotification
				show={popup === 0}
				onClose={setDeletion}
				setPopup={setPopup}
				label="Are you sure want to delete your account?"
			/>
			<PushNotification
				show={popup === 1}
				onClose={setAnonymizes}
				setPopup={setPopup}
				label="Are you sure want to Anonymizes your personal data?"
			/>
		</motion.div>
	);
}

export default Security;
