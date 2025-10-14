import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LandingPageHeader = () => {
	const [logo, setLogo] = useState(false);
	const router = useRouter();

	return (
		<header
			className="h-30 fixed left-0 top-0 flex w-full
					py-6 px-16 sm:justify-between items-center sm:items-center flex-col gap-4 sm:gap-0 sm:flex-row"
		>
			<Image
				src={!logo ? '/logo/rallyu-logo.svg' : '/logo/rallyu-jp.svg'}
				alt="Logo"
				width={138}
				height={38}
				priority={true}
				className={`cursor-pointer pl-0 sm:pl-6 transition-transform duration-500
						${logo ? 'scale-105' : 'scale-100'}`}
				onClick={() => setLogo(!logo)}
			/>

			<div className="flex justify-between h-12 w-58 gap-7 *:cursor-pointer *:hover:scale-102 *:duration-400">
				<button onClick={() => router.push('/login')} className='border bg-white/3 border-card flex-1 rounded-md hover:scale-102 duration-400 hover:ring-2 ring-white/10'>Login</button>
				<button
					onClick={() => router.push('/signup')}
					className="bg-main flex-1 rounded-md whitespace-nowrap 
						hover:bg-main-hover hover:ring-2 ring-white/10
						hover:scale-102 duration-400"
				>
					Sign up
				</button>
			</div>
		</header>
	);
};

export default LandingPageHeader;
