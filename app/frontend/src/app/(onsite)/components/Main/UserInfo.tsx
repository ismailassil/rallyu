import unicaOne from '@/app/fonts/unicaOne';

type UserInfoProps = {
	firstname: string;
};

export default function UserInfo({ firstname }: UserInfoProps) {
	return (
		<header
			className="main-card-wrapper flex px-13 py-10 
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
