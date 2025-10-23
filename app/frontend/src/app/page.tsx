'use client';

import Image from 'next/image';
import Card from './components/LandingPageCard';
import rallyuFeatures from './components/LandingPageCardContent';
import LandingPageHeader from './components/LandingPageHeader';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPageFooter from './components/LandingPageFooter';
import unicaOne from './fonts/unicaOne';
import PublicRoute from './(auth)/components/Guards/PublicRoute';
import { useTranslations } from 'next-intl';

const Page = function () {
	const router = useRouter();
	const [image, setImage] = useState('/image_pp.png');
	const [fade, setFade] = useState(true);
	const t = useTranslations("landing");

	useEffect(() => {
		const interval = setInterval(() => {
			setFade(false);
			setTimeout(() => {
				setImage((prev) =>
					prev === '/image_pp.png' ? '/image_xo.png' : '/image_pp.png',
				);
				setFade(true);
			}, 300);
		}, 8000);

		return () => {
			clearInterval(interval);
		};
	}, [image]);

	return (
		<PublicRoute>
			<LandingPageHeader />
			<div className="w-full h-[calc(100vh-124px)] mt-20 px-12 flex flex-col items-center">
				<div className="max-w-250 flex flex-col justify-between gap-5 h-full">
					<div className="flex flex-col gap-10 items-center">
						<div className="flex mt-40 gap-15 w-full">
							<div>
								<h1 className={`text-6xl mb-10 uppercase ${unicaOne.className}`}>
									<span className='font-bold'>{t('headline')}</span>
								</h1>
								<div className=" w-full flex flex-col gap-5">
									<p dangerouslySetInnerHTML={{__html: t.raw('subheadline')}}/>
									<div className="text-md flex flex-col gap-5">
										<p>
											{t("description.pingpong")}
										</p>
									</div>
									<div className="flex gap-4 mt-10">
										<button
											className="rounded-lg py-3 px-8 bg-amber-600 
											hover:bg-amber-700 hover:ring-2 ring-white/10
											duration-500 hover:scale-105 cursor-pointer w-fit"
											onClick={() => router.push('/login')}
										>
											{t("buttons.play_now")}
										</button>
										<button
											className="rounded-lg py-3 px-8 bg-main 
											hover:bg-main-hover hover:ring-2 ring-white/10
											duration-500 hover:scale-105 cursor-pointer w-fit"
											onClick={() => router.push('/signup')}
											>
											{t("buttons.get_started")}
										</button>
									</div>
								</div>
							</div>
							<Image
								src={image}
								width={400}
								height={300}
								alt=""
								className={`md:block hidden transition-opacity duration-500 
									ease-in-out left-105 -top-15 ${fade ? 'opacity-100' : 'opacity-0'}`}
							/>
						</div>
						<section className="flex flex-col gap-5">
							<h2 className="text-2xl font-black">{t("features.title")}</h2>
							<div className="grid md:grid-cols-2 gap-6">
								{rallyuFeatures.map((feature) => (
									<Card
										key={feature.id}
										title={t("features.items." + feature.id + ".title")}
										text={t("features.items." + feature.id + ".description")}
										Icon={feature.icon}
									/>
								))}
							</div>
						</section>
					</div>
					<LandingPageFooter />
				</div>
			</div>
		</PublicRoute>
	);
};

export default Page;
