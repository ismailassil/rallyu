interface cardTypes {
	title: string;
	text: string;
	Icon: React.ReactElement;
}

const Card = ({ title, text, Icon }: cardTypes) => {
	return (
		<div
			className="flex gap-4 bg-bg p-4 rounded-lg cursor-cell
				hover:scale-102 duration-400 transition-all"
		>
			<div className="flex h-full items-center">{Icon}</div>
			<div>
				<h4 className="font-semibold">{title}</h4>
				<p className="font-light">{text}</p>
			</div>
		</div>
	);
};

export default Card;
