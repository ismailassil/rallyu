import { useRouter } from "next/navigation";
import InputField from "../../components/Form/InputField";
import FormButton from "../../components/UI/FormButton";
import { RotateCw } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError } from "@/app/components/CustomToast";
import useForm from "@/app/hooks/useForm";
import { FormProvider } from "../../components/Form/FormContext";
import AnimatedComponent from "../../components/UI/AnimatedComponent";
import { useTranslations } from "next-intl";
import useValidationSchema from "@/app/hooks/useValidationSchema";

export function SetNewPassword({ token, onSuccess }: { token: string; onSuccess: () => void }) {
	const t = useTranslations("");
	const tautherr = useTranslations("auth");

	const router = useRouter();

	const { resetPasswordUpdateSchema } = useValidationSchema();

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
		resetPasswordUpdateSchema,
		{ password: "", confirm_password: "" },
		{ debounceMs: { password: 1200, confirm_password: 1200 } }
	);

	const { apiClient } = useAuth();

	const { isLoading, executeAPICall } = useAPICall();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid) return;

		try {
			await executeAPICall(() => apiClient.resetPassword(token, formData.password));
			onSuccess();
		} catch (err: any) {
			toastError(tautherr("errorCodes", { code: err.message }));
			router.push("/login");
		}
	}

	return (
		<AnimatedComponent
			componentKey="set-new-password"
			className="flex w-full max-w-lg flex-col gap-5 p-11"
		>
			{/* Header */}
			<div className="mb-4 flex items-center gap-4">
				<div>
					<h1 className="inline-block text-lg font-semibold sm:text-3xl">
						{t("auth.reset_password.setNewPassword.title")}
					</h1>
					<p className="text-sm text-gray-300 sm:text-balance">
						{t("auth.reset_password.setNewPassword.subtitle")}
					</p>
				</div>
			</div>

			<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
						className="field box-border flex flex-col gap-0.5"
						iconSrc="/icons/lock.svg"
						label={t("auth.common.password")}
						field="password"
						inputPlaceholder="••••••••••••••••"
						inputHidden={true}
						autoFocus
					/>
					<InputField
						className="field box-border flex flex-col gap-0.5"
						iconSrc="/icons/lock.svg"
						label={t("auth.common.confirm_password")}
						field="confirm_password"
						inputPlaceholder="••••••••••••••••"
						inputHidden={true}
					/>
				</FormProvider>
				<FormButton
					text={t("auth.common.reset_password")}
					type="submit"
					icon={<RotateCw size={16} />}
					isSubmitting={isLoading}
				/>
			</form>

			<p className="self-center">
				{t("auth.reset_password.setNewPassword.instruction")}{" "}
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
