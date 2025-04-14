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
	[PasswordError.TooShort]:
		"Password is too short. Minimum length is 8 characters.",
	[PasswordError.MissingNumber]: "Password must include at least one number.",
	[PasswordError.MissingUpperCase]:
		"Password must include at least one uppercase letter.",
	[PasswordError.MissingLowerCase]:
		"Password must include at least one lowercase letter.",
	[PasswordError.MissingSpecial]:
		"Password must include at least one special character.",
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
			className="h-full w-full p-4 flex flex-col gap-3 max-w-220 hide-scrollbar overflow-y-scroll"
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 50 }}
			transition={{ type: "spring", stiffness: 120 }}
		>
			<div>
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">Basics</h2>
				<hr className="border-white/10" />
			</div>
			<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
				<label className="flex-1 w-full">
					Change Password
					{error && <p className="text-xs text-red-400">{error}</p>}
				</label>
				<div className="flex-2 flex gap-3 w-full">
					<div className="relative flex-1">
						<input
							className={`w-full h-11 pl-[45px] pr-[10px] bg-bg border-bbg flex items-center justify-center
										gap-[7px] border-2 rounded-lg focus:ring-bbg focus:ring-4 outline-none hover:ring-4 hover:ring-bbg hover:bg-hbbg
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
							className={`w-full h-11 pl-[45px] bg-bg border-bbg flex items-center justify-center
										gap-[7px] border-2 rounded-lg focus:ring-bbg focus:ring-4 outline-none hover:ring-4 hover:ring-bbg hover:bg-hbbg
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
					className="flex items-center gap-4 bg-main rounded-sm py-2 px-4
										hover:scale-101 transform transition-all duration-300
										hover:cursor-pointer mt-3 text-sm lg:text-base"
					onClick={handleSubmit}
				>
					<Check size={22} />
					<p>Update Password</p>
				</button>
			</div>
			<div className="mt-5">
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">
					Two-factor authentication
				</h2>
				<hr className="border-white/10" />
			</div>
			<div className="flex flex-col md:flex-row gap-5 lg:gap-10 text-sm lg:text-base">
				<div className="flex gap-6">
					<div className="w-[110px] h-[110px] bg-white flex items-center justify-center rounded-md">
						<Image src="/qr.png" alt="2FA Qr-Code" width={95} height={95} />
					</div>
					<div className="flex flex-col gap-2 max-w-80 justify-between">
						<label htmlFor="2fa" className="text-gray-400">
							Enter the 6-digit code from your authenticator app
						</label>
						<div className="relative">
							<input
								type="number"
								className={`w-full h-11 pl-[45px] pr-[10px] bg-bg border-bbg flex items-center justify-center
								gap-[7px] border-2 rounded-lg focus:ring-bbg focus:ring-4 outline-none hover:ring-4 hover:ring-bbg hover:bg-hbbg
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
				<div className="flex h-full items-end justify-end flex-1">
					<button
						className="flex items-center gap-4 bg-main rounded-sm py-2.5 px-8
										hover:scale-101 transform transition-all duration-300
										hover:cursor-pointer mt-3 text-sm lg:text-base"
						onClick={handleTwoFa}
					>
						<ShieldCheck size={22} />
						<p>Enable 2FA</p>
					</button>
				</div>
			</div>
			<div className="mt-5">
				<h2 className="text-xl lg:text-2xl mb-1 mt-2 font-semibold">
					Be Caution
				</h2>
				<hr className="border-white/10" />
			</div>
			<button
				className="flex flex-col hover:bg-white/2 ring-1 ring-white/20 rounded-md py-4 px-5
						hover:cursor-pointer hover:ring-2 hover:ring-white/20 hover:scale-101 transform transition-all duration-300 text-left"
				onClick={(e) => {
					e.preventDefault();
					setPopup(0);
				}}
			>
				<h3 className="lg:text-base text-sm font-bold">Delete Account</h3>
				<p className="font-light text-sm lg:text-base text-gray-400">
					This will permanently delete your account and all associated data.
					Action is final.
				</p>
			</button>
			<button
				className="flex flex-col hover:bg-white/2 ring-1 ring-white/20 rounded-md py-4 px-5
						hover:cursor-pointer hover:ring-2 hover:ring-white/20 hover:scale-101 transform transition-all duration-300 text-left"
				onClick={(e) => {
					e.preventDefault();
					setPopup(1);
				}}
			>
				<h3 className="lg:text-base text-sm font-bold">
					Anonymizes your personal data
				</h3>
				<p className="font-light text-sm lg:text-base text-gray-400">
					Your personal information will be anonymized to prevent identification
					or tracking.
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
