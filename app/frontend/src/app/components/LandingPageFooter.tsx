import Image from 'next/image';

const LandingPageFooter = () => {
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
			<p className='text-xs md:text-sm text-right'>© 2025 RALLYU. All rights reserved.</p>
		</div>
	);
};

export default LandingPageFooter;
