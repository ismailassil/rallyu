"use client";

import {
	BarChart,
	Bar,
	Tooltip,
	ResponsiveContainer,
	Cell,
	TooltipProps
} from "recharts";

type BarChartProps<TValueKey extends string, TNameKey extends string> = {
	data: Array<Record<TValueKey, number> & Record<TNameKey, string>> | null;
	dataKey: TValueKey;
	nameKey: TNameKey;
	unit?: string;
	colors?: string[];
};

function ChartBar<TValueKey extends string, TNameKey extends string>({
	data,
	dataKey,
	nameKey,
	unit,
	colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"]
}: BarChartProps<TValueKey, TNameKey>) {
	if (!data || data.length === 0) {
		return (
			<div className="flex h-full items-center justify-center text-gray-400">
				No data available
			</div>
		);
	}

	return (
		<div className="absolute -bottom-[5px] -left-2 w-full">
			<ResponsiveContainer width="104%" height={230}>
				<BarChart data={data}>
					{/* <XAxis dataKey={nameKey} /> */}
					{/* <YAxis /> */}
					<Tooltip
						content={({ active, payload }: TooltipProps<number, string>) =>
							active && payload && payload.length ? (
								<div className="border-br-card ring-3 rounded-lg border-2 bg-white/10 p-2 ring-white/5 backdrop-blur-lg">
									<p>{payload[0].payload[nameKey]}</p>
									<p className="text-xl">
										{payload[0].value}{" "}
										{unit && <span className="text-sm">{unit}</span>}
									</p>
								</div>
							) : null
						}
					/>
					<Bar dataKey={dataKey}>
						{data.map((_, index) => (
							<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default ChartBar;