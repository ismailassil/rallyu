"use client";

import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import AuthButton from "./components/AuthButton";
import Input from "./components/Input";
import ibm from "./fonts/ibm";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const api = "call";

	return (
		<div className="h-screen flex flex-col">
			<nav className="h-30 flex align-center pl-16">
				<Image
					src="/rallyu-logo.svg"
					alt="Logo"
					width={0}
					height={0}
					style={{ width: "auto", height: "auto" }}
					onClick={(e) => {
						e.preventDefault();
						router.push("/");
					}}
					className="hover:cursor-pointer hover:scale-101 transition-transform duration-200"
				></Image>
			</nav>
			<main className="flex-1 flex justify-center items-center">
				<motion.div className="w-[450px]">
					<h1
						className={`${ibm.className} text-[36px] font-bold flex justify-center`}
					>
						Welcome Back!
					</h1>
					<p className={`flex justify-center text-[18px] mb-[47px]`}>
						Please enter your details to sign in
					</p>
					<div className="flex justify-center mb-4 gap-[18px]">
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
								text="Email"
								type="email"
								unique="email"
								src="/mail.svg"
								alt="mail logo"
								width={19}
								height={19}
								placeholder="your@email.com"
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
							<p>
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
				</motion.div>
			</main>
		</div>
	);
}
