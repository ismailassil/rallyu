"use client";

import Form from "next/form";
import Link from "next/link";
// import ibm from "../../fonts/ibm";
import AuthButton from "../components/AuthButton";
import Input from "../components/Input";
import { useState } from "react";
import passwordValidator from "./passwordValidator";
import axios from "axios";
import { useRouter } from "next/navigation";

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

export default function SignUp() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	async function handleSubmit() {
		if (formData.firstName.trim() === "") {
			setError("First name is required.");
			return;
		}
		if (formData.lastName.trim() === "") {
			setError("Last name is required.");
			return;
		}
		if (formData.username.trim().length < 3 || formData.username.trim().length > 20) {
			setError("Username must be between 3 and 20 characters.");
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

		try {
			setLoading(true);
			const response = await axios.post(
				"http://localhost:4004/api/auth/register",
				JSON.stringify(formData),
				{ headers: { "Content-Type": "application/json" } }
			);
			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
			router.push("/dashboard");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.error);
			}
		} finally {
			setLoading(true);
		}
		setError("");
	}

	return (
		<main className="pt-30 flex h-[100vh] w-full pb-10">
			<div className="flex h-full w-full justify-center overflow-auto">
				<div className="flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
					<div className="flex-1">
						<h1 className={`justify-left mb-3 flex text-4xl font-bold md:justify-center`}>
							Create an account
						</h1>
						<p className={`justify-left text-md mb-11 flex md:justify-center`}>
							Please enter your details to create a new account
						</p>
						<div className="mb-4 flex flex-col justify-center gap-4 sm:flex-row">
							<AuthButton
								src="/logo/google-logo.svg"
								width={17}
								height={17}
								alt="Google Logo"
								text="Google"
							/>
							<AuthButton
								src="/logo/42-logo.svg"
								width={21}
								height={15}
								alt="42 Intra Logo"
								text="Intra"
							/>
						</div>
						<div className="mb-[19px] mt-[19px] flex items-center gap-4 text-gray-500">
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
							<div className="mb-[12px] flex flex-col gap-3 sm:flex-row">
								<Input
									text="First Name"
									type="text"
									unique="firstname"
									src="/icons/firstname.svg"
									alt="FirstName logo"
									width={19}
									height={19}
									placeholder="Jorge"
									value={formData.firstName}
									setValue={handleInputChange}
								/>
								<Input
									text="Last Name"
									type="text"
									unique="lastname"
									src="/icons/lastname.svg"
									alt="LastName logo"
									width={19}
									height={19}
									placeholder="Bosh"
									value={formData.lastName}
									setValue={handleInputChange}
								/>
							</div>
							<div className="mb-[12px]">
								<Input
									text="Username"
									type="text"
									unique="username"
									src="/icons/user.svg"
									alt="User logo"
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
									src="/icons/mail.svg"
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
									src="/icons/lock.svg"
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
								className="h-13 bg-main hover:ring-3 hover:ring-main-ring-hover/20 hover:bg-main-hover active:bg-main-active active:ring-main-ring-active
									hover:scale-101 mt-[24px] flex w-full items-center justify-center rounded-lg
									transition-transform duration-300 hover:cursor-pointer"
							>
								{!loading ? (
									<>Sign Up</>
								) : (
									<div className="size-5 mr-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
								)}
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
