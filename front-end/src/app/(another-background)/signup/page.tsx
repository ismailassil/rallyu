import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import ibm from "../../fonts/ibm";
import AuthButton from "../../components/AuthButton";
import Input from "../../components/Input";

export default function SignUp() {
	const api = "Nothing";

	return (
		<div className="h-screen flex flex-col">
			<nav className="h-30 flex align-center pl-16">
				<Image
					src="/rallyu-logo.svg"
					alt="Logo"
					width={0}
					height={0}
					style={{ width: "auto", height: "auto" }}
				></Image>
			</nav>
			<main className="flex-1 flex pl-20 pr-20 justify-left items-center">
				<div className="w-[550px]">
					<h1
						className={`${ibm.className} text-[36px] font-bold flex justify-left`}
					>
						Create an account
					</h1>
					<p className={`flex justify-left text-[18px] mb-[47px]`}>
						Please enter your details to create a new account
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
							/>
							<p className="mt-[7px]  text-sm text-[#8996A9]">
								Minimum length is 8 characters.
							</p>
						</div>

						<button
							type="submit"
							className="w-full h-13 rounded-lg bg-main mt-[24px] flex justify-center items-center hover:cursor-pointer hover:ring-3 hover:ring-main-ring-hover hover:bg-main-hover active:bg-main-active active:ring-main-ring-active"
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
			</main>
		</div>
	);
}
