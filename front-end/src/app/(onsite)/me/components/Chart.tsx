"use client";

import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
} from "recharts";

function Chart({
	data,
}: {
	data: Array<{ date: string; timeSpent: number }> | null;
}) {
	if (!data || data.length === 0) {
		return (
			<div className="h-full flex items-center justify-center text-gray-400">
				No data available
			</div>
		);
	}

	return (
		<div className="absolute -bottom-[5px] -left-2 w-full">
			<ResponsiveContainer width="104%" height={230}>
				<AreaChart data={data}>
					<defs>
						<linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#ffe600" />
							<stop offset="100%" stopColor="#00faff" />
						</linearGradient>
					</defs>
					<Area
						dataKey="timeSpent"
						type="monotone"
						stroke="url(#colorGradient)"
						strokeWidth={3}
						fill="#78d369"
						fillOpacity="7%"
						animationBegin={1000}
						animationDuration={1500}
						animationEasing="ease-in-out"
					/>
					<XAxis dataKey="date" hide={true} />
					<Tooltip content={<CustomTooltip />} />
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

const CustomTooltip = ({
	active,
	payload,
	label,
}: TooltipProps<number, string>) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white/10 backdrop-blur-lg p-2 rounded-lg border-2 border-br-card ring-3 ring-white/5">
				<p>{label}</p>
				<p className="text-xl">
					{payload[0].value} <span className="text-sm">hours</span>
				</p>
			</div>
		);
	}
	return null;
};

export default Chart;
