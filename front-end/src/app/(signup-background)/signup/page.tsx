"use client";

import Form from "next/form";
import Link from "next/link";
import ibm from "../../fonts/ibm";
import AuthButton from "../../(app)/components/AuthButton";
import Input from "../../(app)/components/Input";
import { useState } from "react";
import passwordValidator from "../passwordValidator";

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

export default function SignUp() {
	const [formData, setFormData] = useState({
		firstname: "asdqwe",
		lastname: "qweqwe",
		username: "qwe",
		email: "qweqwe@sdad",
		password: "asdqw12312a! sdasdAe",
	});
	const [error, setError] = useState("");

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	function handleSubmit() {
		if (formData.firstname.trim() === "") {
			setError("First name is required.");
			return;
		}
		if (formData.lastname.trim() === "") {
			setError("Last name is required.");
			return;
		}
		if (formData.username.trim() === "") {
			setError("username is required.");
			return;
		}

		const validationResult = passwordValidator(formData.password);
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

		// ADD API
	}

	return (
		<main className="h-[100vh] w-full pt-30 flex pb-10">
			<div className="w-full h-full flex overflow-auto">
				<div className="w-[650px] h-full pt-20 pb-20 pl-10 pr-10 flex items-start sm:items-center justify-center">
					<div className="flex-1">
						<h1
							className={`${ibm.className} text-[36px] font-bold flex justify-left`}
						>
							Create an account
						</h1>
						<p className={`flex justify-left text-[18px] mb-[47px]`}>
							Please enter your details to create a new account
						</p>
						<div className="flex flex-col sm:flex-row justify-center mb-4 gap-[18px]">
							<AuthButton
								src="/google-logo.svg"
								width={17}
								height={17}
								alt="Google Logo"
								text="Google"
							/>
							<AuthButton
								src="/42-logo.svg"
								width={21}
								height={15}
								alt="42 Intra Logo"
								text="Intra"
							/>
						</div>
						<div className="flex items-center gap-4 text-gray-500 mt-[19px] mb-[19px]">
							<hr className="flex-grow border-t border-gray-300" />
							<span className="text-white">OR</span>
							<hr className="flex-grow border-t border-gray-300" />
						</div>
						<Form
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
							action=""
						>
							<div className="mb-[12px] flex gap-3">
								<Input
									text="First Name"
									type="text"
									unique="firstname"
									src="/firstname.svg"
									alt="FirstName logo"
									width={19}
									height={19}
									placeholder="Jorge"
									value={formData.firstname}
									setValue={handleInputChange}
								/>
								<Input
									text="Last Name"
									type="text"
									unique="lastname"
									src="/lastname.svg"
									alt="LastName logo"
									width={19}
									height={19}
									placeholder="Bosh"
									value={formData.lastname}
									setValue={handleInputChange}
								/>
							</div>
							<div className="mb-[12px]">
								<Input
									text="Username"
									type="text"
									unique="username"
									src="/user.svg"
									alt="mail logo"
									width={19}
									height={19}
									placeholder="jorgebosh"
									value={formData.username}
									setValue={handleInputChange}
								/>
							</div>
							<div className="mb-[12px]">
								<Input
									text="Email"
									type="email"
									unique="email"
									src="/mail.svg"
									alt="mail logo"
									width={19}
									height={19}
									placeholder="jorge@bosh.com"
									value={formData.email}
									setValue={handleInputChange}
								/>
							</div>
							<div className="mb-[12px]">
								<Input
									text="Password"
									type="password"
									src="/lock.svg"
									unique="password"
									alt="Lock logo"
									width={19}
									height={19}
									placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
									value={formData.password}
									setValue={handleInputChange}
								/>

								{!error ? (
									<p className="mt-[7px]  text-sm text-[#8996A9]">
										Minimum length is 8 characters.
									</p>
								) : (
									<p className="mt-[7px] text-sm text-red-400">{error}</p>
								)}
							</div>

							<button
								type="submit"
								className="w-full h-13 rounded-lg bg-main mt-[24px] flex justify-center
									items-center hover:cursor-pointer hover:ring-3 hover:ring-main-ring-hover/20 hover:bg-main-hover active:bg-main-active active:ring-main-ring-active
									hover:scale-101 transition-transform duration-300"
							>
								Sign Up
							</button>
							<div className="mt-[19px] flex justify-center">
								<p>
									Already have an account?{" "}
									<Link
										href="/"
										className="text-main hover:text-blue-400 hover:underline"
									>
										Sign In
									</Link>
								</p>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</main>
	);
}
