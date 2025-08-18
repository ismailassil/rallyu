import unicaOne from '@/app/fonts/unicaOne';
import { useTranslations } from 'next-intl';

const ProfileSnapshot = () => {
	const t = useTranslations("dashboard.titles");

	return (
		<aside
			className={`bg-card border-br-card h-full w-full flex-3 rounded-lg border-2`}
		>
			<div className="group relative shrink-0 overflow-hidden">
				<h1
					className={`${unicaOne.className} px-11 py-9 select-none text-4xl uppercase`}
				>
					{t("snapshots")}
				</h1>
				<div
					className="w-15 h-15 bg-accent
					absolute -left-4 top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg
					transition-all duration-200 group-hover:scale-105"
				/>
			</div>
			<div>Show latest match</div>
			<div>Total games played</div>
			<div>Win streak</div>
			<div>Small graph</div>
		</aside>
	);
};

export default ProfileSnapshot;
