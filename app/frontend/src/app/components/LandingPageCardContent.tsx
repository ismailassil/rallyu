import {
	Chat,
	DeviceMobile,
	GameController,
	Globe,
	PingPong,
	Strategy,
} from '@phosphor-icons/react';

const rallyuFeatures = [
	{
		title: 'Real-Time Matches',
		description:
			'Challenge friends or find random opponents from around the world.',
		icon: <GameController size={26} weight="bold" className="w-10" />,
	},
	{
		title: 'Lightning-Fast Ping Pong',
		description:
			'Fast-paced rallies, thrilling matches, and epic leaderboard climbing excitement.',
		icon: <PingPong size={26} weight="bold" className="w-10" />,
	},
	{
		title: 'Strategic Tic Tac Toe',
		description: 'Simple to learn, strategic to master—every move counts.',
		icon: <Strategy size={26} weight="bold" className="w-10" />,
	},
	{
		title: 'Live Chat',
		description:
			'Talk, laugh, and plan your next move with opponents and friends.',
		icon: <Chat size={26} weight="bold" className="w-10" />,
	},
	{
		title: 'Play Anywhere',
		description:
			'Play anytime, anywhere with a smooth and seamless experience on any device.',
		icon: <DeviceMobile size={26} weight="bold" className="w-10" />,
	},
	{
		title: 'Sleek, Modern UI',
		description:
			'Clean and intuitive design for casual and competitive players alike.',
		icon: <Globe size={26} weight="bold" className="w-10" />,
	},
];

export default rallyuFeatures;
