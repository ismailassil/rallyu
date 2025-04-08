"use client";

import Form from "next/form";
import Link from "next/link";
import AuthButton from "./components/AuthButton";
import Input from "./components/Input";
import ibm from "./fonts/ibm";
// import { motion } from "framer-motion";

export default function Home() {
	const api = "call";

	return (
		<main className="h-[100vh] w-full pt-30 flex items-center justify-center pb-10">
			<div className="w-full h-full flex justify-center overflow-auto">
				<div className="w-[550px] h-full pt-20 pb-20 pl-10 pr-10 flex items-start sm:items-center">
					<div className="flex-1">
						<h1
							className={`${ibm.className} text-[36px] font-bold flex md:justify-center `}
						>
							Welcome Back!
						</h1>
						<p className={`flex md:justify-center text-[18px] mb-[47px]`}>
							Please enter your details to sign in
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
						<Form action={api}>
							<div className="mb-[12px]">
								<Input
									text="Email or Username"
									type="text"
									unique="text"
									src="/at.svg"
									alt="At Logo"
									width={19}
									height={19}
									placeholder="something"
								/>
							</div>
							<div className="mb-[12px]">
								<Input
									text="Password"
									type="password"
									unique="password"
									src="/lock.svg"
									alt="Lock logo"
									width={19}
									height={19}
									placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
								/>
							</div>
							<p className="flex justify-end">
								<span className="underline underline-offset-3 hover:cursor-pointer hover:text-blue-400 text-[15px]">
									Forgot password?
								</span>
							</p>

							<button
								type="submit"
								className="w-full h-13 rounded-lg bg-main mt-[44px] flex justify-center items-center hover:cursor-pointer hover:ring-3 hover:ring-main-ring-hover hover:bg-main-hover active:bg-main-active active:ring-main-ring-active"
							>
								Sign In
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
