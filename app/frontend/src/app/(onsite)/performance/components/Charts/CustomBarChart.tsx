import React from 'react';
import { ResponsiveContainer, Tooltip, TooltipProps, BarChart, Bar, Cell } from 'recharts';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"];

export default function CustomBarChart({
	data,
	nameKey,
	dataKey,
	tooltipFormatter
} : {
	data: Array<Record<string, string | number>>,
	nameKey: string,
	dataKey: string,
	tooltipFormatter: (v: number) => string
}) {
	return (
		<div className='w-full'>
			<ResponsiveContainer width='100%' height={240}>
				<BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
					<Bar dataKey={dataKey}>
						{data.map((_, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Bar>
					<Tooltip
						content={({ active, payload }: TooltipProps<number, string>) =>
							active && payload && payload.length ? (
								<div className="border-br-card ring-3 rounded-lg border-2 bg-white/10 p-2 ring-white/5 backdrop-blur-lg">
									<p>{payload[0].payload[nameKey]}</p>
									<p className="text-xl capitalize">
										{tooltipFormatter(payload[0].value as number)}
									</p>
								</div>
							) : null
						}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
