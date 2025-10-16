import React from 'react';
import { PieChart, ResponsiveContainer, Tooltip, TooltipProps, Pie, Cell } from 'recharts';

// FOR WIS/LOSSES/DRAWS
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"];

export default function CustomPieChart({
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
		<div className='relative pb-10'>
			<ResponsiveContainer width={240} height={240}>
				<PieChart>
					<Pie
						data={data}
						nameKey={nameKey}
						dataKey={dataKey}
						label
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip
						content={({ active, payload }: TooltipProps<number, string>) =>
							active && payload && payload.length ? (
								<div className="border-br-card ring-3 rounded-lg border-2 bg-white/10 p-2 ring-white/5 backdrop-blur-lg">
									<p>{payload[0].name}</p>
									<p className="text-xl capitalize">
										{tooltipFormatter(payload[0].value as number)}
									</p>
								</div>
							) : null
						}
					/>
					{/* <Legend /> */}
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
