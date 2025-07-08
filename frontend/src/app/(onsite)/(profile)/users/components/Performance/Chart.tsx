"use client";

import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	TooltipProps
} from "recharts";

type ChartProps<T extends string> = {
	data: Array<{ date: string } & Record<T, number>> | null;
	dataKey: T;
	unit?: string;
};

function Chart<T extends string>({ data, dataKey, unit }: ChartProps<T>) {
	if (!data || data.length === 0) {
		return (
			<div className="flex h-full items-center justify-center text-gray-400">
				No data available
			</div>
		);
	}

	return (
		<div className="absolute -bottom-[6px] -left-2 w-full">
			<ResponsiveContainer width="104%" height={230}>
				<AreaChart data={data}>
					<defs>
						<linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#ffe600" />
							<stop offset="100%" stopColor="#00faff" />
						</linearGradient>
					</defs>
					<Area
						dataKey={dataKey}
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
					<Tooltip
						content={({ active, payload, label }: TooltipProps<number, string>) =>
							active && payload && payload.length ? (
								<div className="border-br-card ring-3 rounded-lg border-2 bg-white/10 p-2 ring-white/5 backdrop-blur-lg">
									<p>{label}</p>
									<p className="text-xl">
										{payload[0].value}{" "}
										{unit && <span className="text-sm">{unit}</span>}
									</p>
								</div>
							) : null
						}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

export default Chart;