/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, QrCode } from "lucide-react";
import FormButton from "@/app/(auth)/components/UI/FormButton";
import { APITOTPSecrets } from "@/app/(api)/services/MfaService";
import OTPCodeInput from "@/app/(onsite)/[DEPRECATED]2fa/components/OTPCodeInput";
import { toastError } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import AnimatedComponent from "../../UI/AnimatedComponent";
import { APIError } from "@/app/(api)/APIClient";
import { useTranslations } from "next-intl";

interface TOTPVerification {
	onReset: () => void;
	onSuccess: () => void;
	onFailure: () => void;
}

export default function TOTPVerification({ onReset, onSuccess, onFailure }: TOTPVerification) {
	const t = useTranslations('auth.verification');

	const [token, setToken] = useState('');
	const [TOTPSecrets, setTOTPSecrets] = useState<APITOTPSecrets | null>(null);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [hasError, setHasError] = useState(false);
	const inputRefs = useRef([]);

	const {
		apiClient,
		triggerLoggedInUserRefresh
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	useEffect(() => {
		async function fetchTOTPSecrets() {
			try {
				const { token, secrets } = await executeAPICall(() => apiClient.mfa.setupTOTP());
				setToken(token);
				setTOTPSecrets(secrets);
			} catch (err) {
				toastError((err as APIError).message);
			}
		}

		fetchTOTPSecrets();
	}, [apiClient.mfa, executeAPICall]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const OTPJoined = code.join('');
		if (OTPJoined.length !== 6) {
			toastError('Code is required');
			setHasError(true);
			setTimeout(() => {
				setHasError(false);
			}, 1000);
			return ;
		}

		try {
			await executeAPICall(() => apiClient.mfa.verifyTOTP(
				token,
				OTPJoined
			));
			triggerLoggedInUserRefresh();
			onSuccess();
		} catch (err) {
			setHasError(true);
			setTimeout(() => {
				setHasError(false);
				if ((err as APIError).code !== 'AUTH_INVALID_CODE')
					onFailure();
			}, 1000);
			toastError((err as APIError).message);
		}
	}

	return (
		<AnimatedComponent componentKey='setup-totp' className="w-full max-w-lg p-11 flex flex-col gap-5 select-none">
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onReset}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>{t('input.title', { method: 'TOTP' })}</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>{t('input.subtitle', { method: 'TOTP' })}</p>
				</div>
			</div>

			{/* QR Code + Manual Code + OTP Input */}
			<div>
				<div className="flex flex-col items-center gap-8 py-12">
					{TOTPSecrets?.secret_qrcode_url ? (
						<div className="bg-white p-3 rounded-4xl overflow-hidden pointer-events-none">
							<img src={TOTPSecrets.secret_qrcode_url} alt="QR Code" className="w-48 h-48" />
						</div>
					) : (
						<div className="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center">
							<QrCode size={64} className="text-gray-600" />
						</div>
					)}

					<div className="text-center">
						<p className="text-sm text-gray-300 mb-2">{t('input.cant_scan_qr')}</p>
						<code className="bg-gray-800 px-3 py-1 rounded text-xs sm:text-sm font-mono select-text truncate">
							{TOTPSecrets?.secret_base32 || 'XXXX XXXX XXXX XXXX'}
						</code>
					</div>
				</div>

				<form className="flex flex-col gap-3 mt-8" onSubmit={handleSubmit}>
					<p className="text-center text-gray-200 text-sm sm:text-base">{t('verifyCode.subtitle')}</p>

					<OTPCodeInput
						code={code}
						setCode={setCode}
						inputRefs={inputRefs}
						isDisabled={isLoading}
						hasError={hasError}
					/>

					<FormButton
						text='Continue'
						type="submit"
						icon={<ArrowRight size={16} />}
						disabled={code.some((d) => d === '')}
						isSubmitting={isLoading}
					/>
				</form>
			</div>
		</AnimatedComponent>
	);
}
