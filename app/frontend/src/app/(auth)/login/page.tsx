'use client';
import Image from "next/image";
import LoginForm from "./components/LoginForm";
import { useEffect } from "react";

export default function LoginPage() {
	useEffect(() => {
		sessionStorage.removeItem('loginChallengeID');
		sessionStorage.removeItem('enabledMethods');
	}, []);

	return (
		<main className="pt-30 flex h-[100vh] w-full pb-10">
			<div className="flex h-full w-full justify-center overflow-auto">
				<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
					<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
								flex flex-col gap-5'>
						<div className='flex flex-col gap-2 mb-2'>
							<h1 className='font-semibold text-4xl'>Welcome Back!</h1>
							<p className='mb-0 text-gray-200'>Please enter you details to sign in.</p>
						</div>
						<div className='flex flex-row h-11 gap-2 '>
							<div className='custom-input button-w-logo bg-white/6 flex-1/2 flex flex-row justify-center items-center gap-2 rounded-lg border border-white/10 cursor-pointer'
							onClick={() => alert('DEV - NOT IMPLEMENTED YET')}>
								<Image alt='Google' src='/logo/google-logo.svg' width={20} height={20}></Image>
								<p  className='max-sm:hidden'>Google</p>
							</div>
							<div className='custom-input button-w-logo bg-white/6 flex-1/2 flex flex-row justify-center items-center gap-2 rounded-lg border border-white/10 cursor-pointer'
							onClick={() => alert('DEV - NOT IMPLEMENTED YET')}>
								<Image alt='Google' src='/logo/42-logo.svg' width={24} height={24}></Image>
								<p  className='max-sm:hidden'>Intra</p>
							</div>
						</div>
						<div className='or-separator flex flex-row gap-2 justify-center items-center text-gray-200'>OR</div>
						<LoginForm />
						<p className='self-center'>Don&#39;t have an account yet? <a href='/signup' className='font-semibold  text-blue-500 hover:underline'>Sign Up</a></p>
					</div>
				</div>
			</div>
		</main>
	);
}
