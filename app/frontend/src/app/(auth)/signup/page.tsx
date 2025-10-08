'use client';
import Image from "next/image";
import SignUpForm from "./components/SignUpForm";
import { useRouter } from "next/navigation";
import AuthPageWrapper from "../components/shared/ui/AuthPageWrapper";

async function handleGoogleLogin() {
	window.location.href = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}/api/auth/google`;
}
async function handleIntra42Login() {
	window.location.href = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}/api/auth/42`;
}

export default function SignUpPage() {
	const router = useRouter();
	return (
		<AuthPageWrapper wrapperKey="signup-page-wrapper">
			<div className='w-full max-w-lg p-11 flex flex-col gap-5'>
				<div className='flex flex-col gap-2 mb-2'>
					<h1 className='font-semibold text-4xl'>Create an account</h1>
					<p className='mb-0 text-gray-200'>Please enter you details to sign up.</p>
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
				<SignUpForm />
				<p className='self-center'>Already have an account? <a onClick={() => router.push('/login')} className='font-semibold  text-blue-500 hover:underline cursor-pointer'>Login</a></p>
			</div>
		</AuthPageWrapper>
	);
}
