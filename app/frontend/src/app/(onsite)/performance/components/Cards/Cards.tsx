import Image from "next/image";
import CountUp from "react-countup";

type StatItem = {
	label: string;
	value: string | number;
	valueClass?: string;
};
  
type StatCardProps = {
	title: string;
	items: StatItem[];
};

export function StatCard({ title, value, suffix, decimals, subtitle, subtitleColor, icon } : { title: string, value: number | string, suffix?: string, decimals?: number, subtitle: string, icon: React.ReactNode, subtitleColor: string }) {
	return (
		<div className="bg-white/4 border border-white/10 w-full rounded-2xl px-4 py-3 flex flex-col gap-7 flex-1">
			<div className="flex items-center justify-between">
				<p className="font-bold text-xl">{title}</p>
				{icon}
			</div>
			<div className="flex items-end justify-between">
				{
					typeof value === 'number' ? <CountUp 
						end={value} 
						suffix={suffix || ''}
						duration={4} 
						decimals={decimals || 0} 
						useEasing={true} 
						className="font-extrabold text-3xl"
					/> : <p className="font-extrabold text-3xl">{value}</p>
				}
				<p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
			</div>
		</div>
	);
}

export const StatDetailedCard: React.FC<StatCardProps> = ({ title, items }) => (
	<div className="bg-white/4 border border-white/10 w-full rounded-2xl px-4 py-3 overflow-hidden flex-2">
		<h1 className="font-bold text-xl mb-4">{title}</h1>
		<div className="flex flex-col gap-1">
			{items.map((item, idx) => (
			<div key={idx} className="flex justify-between">
				<p className="font-medium text-lg text-white/70">{item.label}</p>
				<p className={`font-extrabold text-xl ${item.valueClass ?? "text-white/90"}`}>
				{item.value}
				</p>
			</div>
			))}
		</div>
	</div>
);

export function ChartCard({
	chartTitle,
	chartSubtitle,
	className,
	isEmpty,
	children
} : {
	chartTitle: string,
	chartSubtitle: string,
	className: string,
	isEmpty: boolean,
	children: React.ReactNode
}) {
	const finalClassName = `bg-white/4 border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-between ${className}`;

	return (
		<div className={finalClassName}>
			<div className='w-full p-4'>
				<h1 className='font-funnel-display font-bold text-xl text-white/90 select-none'>{chartTitle}</h1>
				<p className="text-sm text-violet-400">{chartSubtitle}</p>
			</div>
			{isEmpty ? (
				<div className='h-full flex flex-col justify-center items-center gap-2'>
					<Image
						src={'/meme/thinking.gif'}
						width={240}
						height={240}
						alt="No data available"
						className="rounded-2xl blur-[1.25px] hover:blur-none transition-all duration-500 hover:scale-102 cursor-grab"
						draggable={false}
					/>
					<h1 className="text-white/60">No data available</h1>
				</div>
			) : (
				children
			)}
		</div>
	);
}
