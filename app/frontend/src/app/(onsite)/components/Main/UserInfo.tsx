import unicaOne from "@/app/fonts/unicaOne";
import { useTranslations } from "next-intl";

type UserInfoProps = {
	firstname: string;
};

export default function UserInfo({ firstname }: UserInfoProps) {
	const t = useTranslations("dashboard.titles");

	return (
		<header className="bg-card border-br-card flex w-full items-center overflow-hidden rounded-lg border-2 px-13 py-10">
			<h1 className={`${unicaOne.className} text-4xl font-semibold lg:text-4xl`}>
				{t("greetings").toUpperCase()}{" "}
				<span className="text-accent font-bold">{firstname}</span>
			</h1>
		</header>
	);
}
