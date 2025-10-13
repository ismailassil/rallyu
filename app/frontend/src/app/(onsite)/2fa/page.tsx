/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MethodsOverview from "./components/Overview";
import { toastSuccess, toastError } from "@/app/components/CustomToast";
import MainCardWrapper from "../components/UI/MainCardWrapper";
import { motion } from "framer-motion";
import PhoneVerification from "@/app/(auth)/components/Verification/Phone/PhoneVerification";
import EmailVerification from "@/app/(auth)/components/Verification/Email/EmailVerification";
import TOTPVerification from "@/app/(auth)/components/Verification/TOTP/TOTPVerification";
import { useAuth } from "../contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import Done from "./components/Done";

enum STEP {
	OVERVIEW = 'OVERVIEW',
	TOTP = 'TOTP',
	SMS = 'SMS',
	EMAIL = 'EMAIL',
	DONE = 'DONE'
}

export default function TwoFAManagerPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState<STEP>(STEP.DONE);

	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();


	function handleSetup(m: string) {
		switch (m) {
			case 'TOTP': {
				setCurrentStep(STEP.TOTP);
				break;
			}
			case 'SMS': {
				setCurrentStep(STEP.SMS);
				break;
			}
			case 'EMAIL': {
				setCurrentStep(STEP.EMAIL);
				break;
			}
		}
	}

	async function handleEnableAfterVerification(m: 'TOTP' | 'SMS' | 'EMAIL') {
		try {
			await executeAPICall(() => apiClient.mfa.enableMethod(m));
			toastSuccess(`2FA via ${m} enabled`);
		} catch (err: any) {
			toastError(err.message);
		}
	}

	function renderCurrentStep() {
		switch (currentStep) {
			case STEP.OVERVIEW:
				return (
					<MethodsOverview
						onSetup={(m) => handleSetup(m)}
					/>
				);
			case STEP.TOTP:
				return (
					<TOTPVerification
						onReset={() => setCurrentStep(STEP.OVERVIEW)}
						onSuccess={() => setCurrentStep(STEP.DONE)}
						onFailure={() => toastError('onFailure')}
					/>
				);
			case STEP.SMS:
				return (
					<PhoneVerification
						onReset={() => setCurrentStep(STEP.OVERVIEW)}
						onSuccess={() => {
							handleEnableAfterVerification('SMS');
							setCurrentStep(STEP.DONE);
						}}
						onFailure={() => toastError('onFailure')}
					/>
				);
			case STEP.EMAIL:
				return (
					<EmailVerification
						onReset={() => setCurrentStep(STEP.OVERVIEW)}
						onSuccess={() => {
							handleEnableAfterVerification('EMAIL');
							setCurrentStep(STEP.DONE);
						}}
						onFailure={() => toastError('onFailure')}
					/>
				);
			case STEP.DONE:
				return (
					<Done
						onDashboard={() => router.push('/dashboard')}
						onSetupAnotherMethod={() => setCurrentStep(STEP.OVERVIEW)}
					/>
				);
			default:
				return null;
		}
	}


	return (
		<>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<MainCardWrapper className="h-full w-full custom-scrollbar font-funnel-display">
					<div className="h-full w-full flex justify-center items-center overflow-auto px-4 py-16">
						{renderCurrentStep()}
					</div>
				</MainCardWrapper>
			</motion.main>
		</>
	);
}
