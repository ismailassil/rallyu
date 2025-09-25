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
		<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 flex flex-col gap-7 flex-1">
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
	<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 overflow-hidden flex-2">
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

export function ChartCard({ title, subtitle, chart } : { title: string, subtitle: string, chart: React.ReactNode }) {
	return (
		<div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-4 flex flex-col h-full overflow-hidden">
			<h2 className="font-bold text-lg">{title}</h2>
			<p className="text-sm text-violet-400 mb-4">{subtitle}</p>
			<div className="flex-1 overflow-hidden">{chart}</div>
		</div>
	);
}