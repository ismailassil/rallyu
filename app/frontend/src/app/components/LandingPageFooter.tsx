import { useTranslations } from 'next-intl';
import Image from 'next/image';

const LandingPageFooter = () => {
	const t = useTranslations("landing");

	return (
		<div className="flex justify-between">
			<Image
				src={'/logo/rallyu-logo.svg'}
				alt="Logo"
				width={70}
				height={38}
				priority={true}
				className={`cursor-pointer transition-transform duration-500`}
			/>
			<p className='text-xs md:text-sm text-right'>{t('footer.copyright')}</p>
		</div>
	);
};

export default LandingPageFooter;
