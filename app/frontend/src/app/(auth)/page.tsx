"use client";

import Form from "next/form";
import Link from "next/link";
import AuthButton from "./components/AuthButton";
import Input from "./components/Input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

/**
 * to set the `Set-Cookie` in the header
 * add this flag to true - `withCredentials: true`
 */

export default function Home() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	function handleInputChange(field: string, value: string) {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}

	async function handleSubmit() {
		console.log(formData);
		try {
			setLoading(true);
			const response = await axios.post(
				"http://localhost:4004/api/auth/login",
				JSON.stringify(formData),
				{ headers: { "Content-Type": "application/json" } }
			);
			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
			router.push("/dashboard");
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data.error);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="pt-30 flex h-[100vh] w-full items-center justify-center pb-10">
			<div className="flex h-full w-full justify-center overflow-auto">
				<div className="flex h-full w-[550px] items-start pb-20 pl-10 pr-10 pt-20 lg:items-center">
					<div className="flex-1">
						<h1 className={`mb-3 flex text-4xl font-bold md:justify-center `}>
							Welcome Back!
						</h1>
						<p className={`text-md mb-11 flex md:justify-center`}>
							Please enter your details to Sign In
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
							action=""
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
						>
							<div className="mb-[12px]">
								<Input
									text="Email or Username"
									type="text"
									unique="username"
									src="/icons/at.svg"
									alt="At Logo"
									width={19}
									height={19}
									placeholder="something"
									value={formData.username}
									setValue={handleInputChange}
								/>
							</div>
							<div className="mb-[12px]">
								<Input
									text="Password"
									type="password"
									unique="password"
									src="/icons/lock.svg"
									alt="Lock logo"
									width={19}
									height={19}
									placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
									value={formData.password}
									setValue={handleInputChange}
								/>
							</div>
							<div className="flex justify-between">
								<p className="text-sm text-red-400">
									{error && <>&#10005;</>} {error}
								</p>
								<p className="flex justify-end">
									<span className="underline-offset-3 text-sm underline hover:cursor-pointer hover:text-blue-400">
										Forgot password?
									</span>
								</p>
							</div>

							<button
								type="submit"
								className={`h-13 bg-main hover:ring-3 hover:ring-main-ring-hover/20
									hover:bg-main-hover active:bg-main-active
									active:ring-main-ring-active hover:scale-101 mt-[44px] flex
									w-full items-center justify-center rounded-lg
									transition-transform duration-300 hover:cursor-pointer
									`}
							>
								{!loading ? (
									<>Sign In</>
								) : (
									<div className="size-5 mr-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
								)}
							</button>
							<div className="mt-[19px] flex justify-center">
								<p className="text-wrap text-center">
									Don&apos;t have an account yet?{" "}
									<Link
										href="/signup"
										className="text-main hover:text-blue-400 hover:underline"
									>
										Sign Up
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
