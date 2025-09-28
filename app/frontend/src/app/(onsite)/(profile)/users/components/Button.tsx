import LocalIcon from "./LocalIcon";

export default function Button({ text, icon, onClick } : { text: string, icon: string, onClick?: () => void } ) {
	return (
		<button className='profile-card-button flex flex-row px-3.5 py-2 gap-3 items-center cursor-pointer select-none'
				onClick={onClick}
		>
			<LocalIcon src={icon} height={20} width={20} alt={text} />
			<p className='text-[16px] sm:text-lg text-white/85'>{text}</p>
		</button>
	);
}
