import Image from "next/image";
import SignUpForm from "./components/SignUpForm";
// import Background from "../components/Background";

export default function SignUpPage() {
	return (
		<>
			{/* <Background type='main' /> */}
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
									flex flex-col gap-5'>
							<div className='flex flex-col gap-2 mb-2'>
								<h1 className='font-semibold text-4xl'>Create an account</h1>
								<p className='mb-0 text-gray-200'>Please enter you details to sign up.</p>
							</div>
							<div className='flex flex-row h-11 gap-2 '>
								<div className='custom-input button-w-logo bg-white/6 flex-1/2 flex flex-row justify-center items-center gap-2 rounded-lg border border-white/10'>
									<Image alt='Google' src='/logo/google-logo.svg' width={20} height={20}></Image>
									<p  className='max-sm:hidden'>Google</p>
								</div>
								<div className='custom-input button-w-logo bg-white/6 flex-1/2 flex flex-row justify-center items-center gap-2 rounded-lg border border-white/10'>
									<Image alt='Google' src='/logo/42-logo.svg' width={24} height={24}></Image>
									<p  className='max-sm:hidden'>Intra</p>
								</div>
							</div>
							<div className='or-separator flex flex-row gap-2 justify-center items-center text-gray-200'>OR</div>
							<SignUpForm />
							<p className='self-center'>Already have an account? <a href='/login' className='font-semibold  text-blue-500 hover:underline'>Login</a></p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
