import React, { useState } from "react";
import { METHODS_META } from "./constants";
import { Fingerprint, LoaderCircle, ChevronRight } from "lucide-react";
import { toastError } from "@/app/components/CustomToast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import AnimatedComponent from "../../components/UI/AnimatedComponent";
import { useTranslations } from "next-intl";

interface MethodsOverviewProps {
	loginSessionMeta: { token: string; enabledMethods: string[] };
	onSuccess: (m: string) => void;
	onFailure: () => void;
}

export default function Overview({ loginSessionMeta, onSuccess, onFailure }: MethodsOverviewProps) {
	const router = useRouter();

	const t = useTranslations("auth.twoFactorAtLogin.overview");
	const tautherr = useTranslations("auth");

	const { apiClient } = useAuth();

	const { isLoading, executeAPICall } = useAPICall();

	const [selectedMethod, setSelectedMethod] = useState<"TOTP" | "SMS" | "EMAIL" | null>(null);

	async function handleSelect(m: "TOTP" | "SMS" | "EMAIL") {
		if (!["TOTP", "SMS", "EMAIL"].includes(m)) {
			toastError("Please sign in again.");
			router.replace("/login");
			return;
		}

		setSelectedMethod(m);
		try {
			await executeAPICall(() => apiClient.auth.select2FAMethod(loginSessionMeta.token, m));
			onSuccess(m);
		} catch (err: any) {
			toastError(tautherr("errorCodes", { code: err.message }));
			onFailure();
		}
		setSelectedMethod(null);
	}

	const ORDER = ["TOTP", "EMAIL", "SMS"];

	return (
		<AnimatedComponent
			componentKey="2fa-chall-overview"
			className="flex w-full max-w-2xl flex-col gap-5 p-11"
		>
			{/* Header */}
			<div className="mb-12 flex flex-col">
				<Fingerprint size={64} className="mb-6 self-center rounded-full bg-blue-500 p-2" />
				<h1 className="mb-3 text-center text-3xl font-semibold">{t("title")}</h1>
				<p className="mb-0 text-center text-white/85">{t("subtitle")}</p>
			</div>

			{/* Methods List */}
			<div className="flex w-full flex-col gap-4">
				{ORDER.filter((m) => loginSessionMeta.enabledMethods.includes(m)).map((m) => {
					return (
						<button
							key={m}
							onClick={() => handleSelect(m as "TOTP" | "SMS" | "EMAIL")}
							disabled={isLoading}
							className={`single-two-fa-card ${isLoading ? "pointer-events-none cursor-not-allowed brightness-75" : "cursor-pointer"}`}
						>
							<div className="flex w-full items-center justify-between gap-0">
								<div className="flex items-center gap-4">
									{METHODS_META[m].icon}
									<div>
										<h1 className="mb-1.5 flex items-center gap-4 text-lg font-semibold sm:text-base md:text-lg lg:text-2xl">
											{t("cards.title", { method: m })}
										</h1>
										<p className="text-sm font-light text-white/75 lg:text-base">
											{t("cards.subtitle", { method: m })}
										</p>
									</div>
								</div>
								{isLoading && selectedMethod === m ? (
									<LoaderCircle size={36} className="ml-auto animate-spin" />
								) : (
									<ChevronRight size={36} className="ml-auto" />
								)}
							</div>
						</button>
					);
				})}
			</div>
		</AnimatedComponent>
	);
}
