import { FormProvider } from "@/app/(auth)/components/Form/FormContext";
import InputField from "@/app/(auth)/components/Form/InputField";
import FormButton from "@/app/(auth)/components/UI/FormButton";
import useForm from "@/app/hooks/useForm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import AnimatedComponent from "../../UI/AnimatedComponent";
import NoteBox from "@/app/components/NoteBox";
import { useTranslations } from "next-intl";
import useValidationSchema from "@/app/hooks/useValidationSchema";

interface VerifyEmailProps {
	onNext: (token: string) => void;
	onGoBack: () => void;
}

export default function VerifyEmail({ onGoBack, onNext }: VerifyEmailProps) {
	const t = useTranslations("auth");
	const tautherr = useTranslations("auth");

	const { apiClient, loggedInUser } = useAuth();

	const { emailOnlySchema } = useValidationSchema();

	const [
		formData,
		touched,
		errors,
		debounced,
		handleChange,
		validateAll,
		getValidationErrors,
		resetForm,
	] = useForm(
		emailOnlySchema,
		{ email: loggedInUser!.email || "" },
		{ debounceMs: { email: 1200 } }
	);

	const { isLoading, executeAPICall } = useAPICall();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid) return;

		try {
			const { token } = await executeAPICall(() =>
				apiClient.verify.requestEmail(formData.email)
			);
			onNext(token);
		} catch (err: any) {
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	return (
		<AnimatedComponent
			className="flex w-full max-w-lg flex-col gap-5 p-11 select-none"
			componentKey="verify-email-setup"
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
						{t("verification.input.title", { method: "EMAIL" })}
					</h1>
					<p className="text-sm text-gray-300 sm:text-balance">
						{t("verification.input.subtitle", { method: "EMAIL" })}
					</p>
				</div>
			</div>

			{/* Email Input + Continue Button */}
			<form className="flex flex-col gap-3" onSubmit={handleSubmit}>
				<FormProvider
					formData={formData}
					errors={errors}
					debounced={debounced}
					touched={touched}
					handleChange={handleChange}
					validateAll={validateAll}
					getValidationErrors={getValidationErrors}
					resetForm={resetForm}
				>
					<InputField
						className="field flex min-w-0 flex-1 flex-col gap-0.5"
						iconSrc="/icons/mail.svg"
						label=""
						field="email"
						inputPlaceholder="iassil@student.1337.ma"
						autoFocus
					/>
				</FormProvider>
				<FormButton
					text={t("common.continue")}
					type="submit"
					icon={<ArrowRight size={16} />}
					isSubmitting={isLoading}
				/>
			</form>

			<NoteBox
				title={t("verification.note.title")}
				className="mt-2 bg-blue-500/6 text-blue-400 md:text-sm"
			>
				<br></br>
				{t("verification.note.first")}
				<br></br>
				{t("verification.note.second")}
			</NoteBox>
		</AnimatedComponent>
	);
}
