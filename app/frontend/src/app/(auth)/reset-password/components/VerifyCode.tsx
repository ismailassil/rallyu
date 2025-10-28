"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import OTPCodeInput from "../../components/Form/OTPCodeInput";
import { useRef, useState } from "react";
import FormButton from "../../components/UI/FormButton";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError } from "@/app/components/CustomToast";
import AnimatedComponent from "../../components/UI/AnimatedComponent";
import ResendCode from "../../components/Verification/ResendCode";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface VerifyCodeProps {
	token: string;
	onSuccess: () => void;
	onFailure: () => void;
	onGoBack: () => void;
}

export function VerifyCode({ token, onSuccess, onFailure, onGoBack }: VerifyCodeProps) {
	const t = useTranslations("");
	const tautherr = useTranslations("auth");

	const router = useRouter();

	const { apiClient } = useAuth();

	const { isLoading: isVerifyingCode, executeAPICall: verifyCode } = useAPICall();
	const { isLoading: isResendingCode, executeAPICall: resendCode } = useAPICall();

	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [hasError, setHasError] = useState(false);
	const inputRefs = useRef([]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const OTPJoined = code.join("");
		if (OTPJoined.length !== 6) {
			setHasError(true);
			setTimeout(() => {
				setHasError(false);
			}, 1000);
			return;
		}

		try {
			await verifyCode(() => apiClient.verifyPasswordResetCode(token, OTPJoined));
			onSuccess();
		} catch (err: any) {
			if (err.message === "AUTH_INVALID_CODE") {
				setHasError(true);
				setTimeout(() => setHasError(false), 1000);
			} else {
				toastError(tautherr("errorCodes", { code: err.message }));
				onFailure();
			}
		}
	}

	async function handleResend() {
		try {
			await resendCode(() => apiClient.resetPasswordResend(token));
		} catch (err: any) {
			onFailure();
			toastError(tautherr("errorCodes", { code: err.message }));
		}
	}

	return (
		<AnimatedComponent
			componentKey="reset-password-verify"
			className="flex w-full max-w-lg flex-col gap-5 p-11"
		>
			{/* Header + Go Back */}
			<div className="mb-2 flex items-center gap-4">
				<button
					onClick={onGoBack}
					className="cursor-pointer rounded-2xl bg-blue-500/25 p-2 transition-all duration-300 hover:bg-blue-500/90"
				>
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className="inline-block text-lg font-semibold sm:text-3xl">
						{t("auth.reset_password.verifyCode.title")}
					</h1>
					<p className="text-sm text-gray-300 sm:text-balance">
						{t("auth.reset_password.verifyCode.subtitle")}
					</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<form className="flex flex-col gap-3" onSubmit={handleSubmit}>
				<OTPCodeInput
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isDisabled={isResendingCode || isVerifyingCode}
					hasError={hasError}
				/>

				<FormButton
					text={t("auth.common.continue")}
					type="submit"
					icon={<ArrowRight size={16} />}
					disabled={
						isResendingCode || isVerifyingCode || code.some((d) => d === "") || hasError
					}
					isSubmitting={isVerifyingCode}
				/>

				<ResendCode
					isDisabled={isVerifyingCode || isResendingCode}
					onResend={handleResend}
					onMaxResends={onFailure}
				/>
			</form>
			<p className="mt-2 self-center">
				{t("auth.reset_password.verifyCode.instruction")}{" "}
				<span
					onClick={() => router.push("/signup")}
					className="cursor-pointer font-semibold text-blue-500 hover:underline"
				>
					{t("auth.common.signin")}
				</span>
			</p>
		</AnimatedComponent>
	);
}
