'use client';
import Image from "next/image";
import SignUpForm from "./components/SignUpForm";
import { useRouter, useSearchParams } from "next/navigation";
import AuthPageWrapper from "../components/UI/AuthPageWrapper";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toastError } from "@/app/components/CustomToast";

export default function SignUpPage() {
	const t = useTranslations('auth');
	const tautherr = useTranslations('auth');

	const searchParams = useSearchParams();
	const router = useRouter();

	async function handleGoogleLogin() {
		window.location.href = `${window.location.origin}/api/auth/google?frontendOrigin=${window.location.origin}/signup`;
	}
	async function handleIntra42Login() {
		window.location.href = `${window.location.origin}/api/auth/42?frontendOrigin=${window.location.origin}/signup`;
	}

	useEffect(() => {
		if (searchParams.has('error')) {
			let err = searchParams.get('error');
			if (!err || err === 'access_denied') err = 'AUTH_OAUTH_FAILED';
			toastError(tautherr('errorCodes', { code: err }));
		}
	}, []);

	return (
		<AuthPageWrapper wrapperKey="signup-page-wrapper">
			<div className='w-full max-w-lg p-11 flex flex-col gap-5'>
				<div className='flex flex-col gap-2 mb-2'>
					<h1 className='font-semibold text-4xl'>{t('signup.title')}</h1>
					<p className='mb-0 text-gray-200'>{t('signup.subtitle')}</p>
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
				<div className='or-separator flex flex-row gap-2 justify-center items-center text-gray-200'>{t('common.or')}</div>
				<SignUpForm />
				<p className='self-center'>{t('signup.instruction')} <a onClick={() => router.push('/login')} className='font-semibold  text-blue-500 hover:underline cursor-pointer'>{t('common.login')}</a></p>
			</div>
		</AuthPageWrapper>
	);
}
