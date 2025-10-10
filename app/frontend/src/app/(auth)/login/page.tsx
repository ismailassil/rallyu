'use client';
import Image from "next/image";
import LoginForm from "./components/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPageWrapper from "../components/UI/AuthPageWrapper";

export default function LoginPage() {
	const router = useRouter();

	useEffect(() => {
		sessionStorage.removeItem('loginChallengeID');
		sessionStorage.removeItem('enabledMethods');
	}, []);

	async function handleGoogleLogin() {
		window.location.href = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/google`;
	}
	async function handleIntra42Login() {
		window.location.href = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/42`;
	}

	return (
		<AuthPageWrapper wrapperKey="login-page-wrapper">
			<div className='w-full max-w-lg p-11 flex flex-col gap-5'>
				<div className='flex flex-col gap-2 mb-2'>
					<h1 className='font-semibold text-4xl'>Welcome Back!</h1>
					<p className='mb-0 text-gray-200'>Please enter you details to sign in.</p>
				</div>
				<div className='flex flex-row h-11 gap-2 '>
					<div className='custom-input button-w-logo bg-white/6 flex-1/2 flex flex-row justify-center items-center gap-2 rounded-lg border border-white/10 cursor-pointer'
						onClick={handleGoogleLogin}>
						<Image alt='Google' src='/logo/google-logo.svg' width={20} height={20}></Image>
						<p  className='max-sm:hidden'>Google</p>
					</div>
					<div className='custom-input button-w-logo bg-white/6 flex-1/2 flex flex-row justify-center items-center gap-2 rounded-lg border border-white/10 cursor-pointer'
					onClick={handleIntra42Login}>
						<Image alt='Google' src='/logo/42-logo.svg' width={24} height={24}></Image>
						<p  className='max-sm:hidden'>Intra</p>
					</div>
				</div>
				<div className='or-separator flex flex-row gap-2 justify-center items-center text-gray-200'>OR</div>
				<LoginForm />
				<p className='self-center'>Don&#39;t have an account yet? <a onClick={() => router.push('/signup')} className='font-semibold  text-blue-500 hover:underline cursor-pointer'>Sign Up</a></p>
			</div>
		</AuthPageWrapper>
	);
}
