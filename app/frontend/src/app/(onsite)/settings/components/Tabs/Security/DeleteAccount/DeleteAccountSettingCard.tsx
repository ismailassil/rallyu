import React, { useEffect, useState } from "react";
import SettingsCard from "../../../SettingsCard";
import { Trash2, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";

function DeleteAccountModal({ onCloseModal }: { onCloseModal: () => void }) {
	const t = useTranslations("settings.security.cards.delete_account.modal");

	const { apiClient, loggedInUser, logout } = useAuth();

	const { executeAPICall, isLoading: isSubmitting } = useAPICall();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onCloseModal();
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onCloseModal]);

	async function handleSubmit() {
		if (!loggedInUser) return;

		try {
			await executeAPICall(() => apiClient.user.deleteUser(loggedInUser.id));
			await logout();
		} catch {
		} finally {
			onCloseModal();
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
			onClick={onCloseModal}
		>
			<div
				className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/8 bg-neutral-900"
				onClick={(e) => e.stopPropagation()}
			>
				{/* CONTENT */}
				<div className="p-6 sm:p-8">
					<div className="mb-8 flex items-center gap-3">
						<div className="rounded-xl bg-red-500/20 p-3">
							<Trash2 className="text-red-400" size={24} />
						</div>
						<h2 id="modal-title" className="text-2xl font-bold text-white">
							{t("title")}
						</h2>
					</div>

					<div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5">
						<p className="leading-relaxed text-gray-300">
							{t("text1")}{" "}
							<span className="font-semibold text-red-400">{t("text2")}</span>{" "}
							{t("text3")} <br></br>
							{t("text4")} <code className="text-gray-400">{t("text5")}</code>.
						</p>
						<p className="mt-3 flex items-center gap-1 text-base font-bold text-red-400">
							<TriangleAlert size={16} /> {t("warning1")}
						</p>
						<p className="mt-3 flex items-center gap-1 text-base font-bold text-red-400">
							<TriangleAlert size={16} /> {t("warning2")}
						</p>
					</div>

					{/* ACTION BUTTONS */}
					<div className="mt-8 flex w-full gap-4">
						<button
							className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-0 text-sm font-medium transition-all duration-500 ease-in-out select-none hover:bg-white/10 md:px-5 md:py-1.5 md:text-base ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
							onClick={onCloseModal}
							disabled={isSubmitting}
						>
							{t("button1")}
						</button>
						<button
							className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-0 text-sm font-medium text-white transition-all duration-500 ease-in-out select-none hover:bg-red-500/60 md:px-5 md:py-1.5 md:text-base ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
							onClick={handleSubmit}
							disabled={isSubmitting}
						>
							{t("button2")}
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default function DeleteAccountSettingCard() {
	const t = useTranslations("settings.security.cards.delete_account");
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<SettingsCard
				title={t("title")}
				subtitle={t("subtitle")}
				actionButtonOptions={{
					title: t("button"),
					icon: <Trash2 size={16} />,
					onClick: () => setIsModalOpen(true),
				}}
			></SettingsCard>
			<AnimatePresence>
				{isModalOpen && <DeleteAccountModal onCloseModal={() => setIsModalOpen(false)} />}
			</AnimatePresence>
		</>
	);
}
