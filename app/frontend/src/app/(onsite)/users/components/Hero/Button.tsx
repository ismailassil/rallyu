import LocalIcon from "./LocalIcon";

export default function Button({ text, icon, lucide_icon, onClick } : { text: string, icon?: string, lucide_icon?: React.ReactNode, onClick?: () => void } ) {
	return (
		<button className='profile-card-button flex flex-row px-3.5 py-2 gap-3 items-center cursor-pointer select-none '
				onClick={onClick}
		>
			<div className='h-full flex items-center'>
				{icon && <LocalIcon src={icon} height={20} width={20} alt={text} />}
			</div>
			{!icon && lucide_icon}
			<p className='text-xs lg:text-base xl:text-lg text-white/85'>{text}</p>
		</button>
	);
}
