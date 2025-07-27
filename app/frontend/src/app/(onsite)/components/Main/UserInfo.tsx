import unicaOne from '@/app/fonts/unicaOne';

type UserInfoProps = {
	firstname: string;
};

export default function UserInfo({ firstname }: UserInfoProps) {
	return (
		<header
			className="px-13 py-10 bg-card border-br-card flex
				w-full items-center overflow-hidden rounded-lg border-2"
		>
			<h1
				className={`${unicaOne.className} text-4xl font-semibold lg:text-4xl`}
			>
				WELCOME BACK, <span className="text-accent font-bold">{firstname}</span>
			</h1>
		</header>
	);
}
