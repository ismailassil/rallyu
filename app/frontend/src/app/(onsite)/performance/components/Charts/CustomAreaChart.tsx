import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from 'recharts';

export default function CustomAreaChart({
	data,
	dataKeyX,
	dataKeyY,
	tooltipFormatter
} : {
	data: Array<Record<string, string | number>>,
	dataKeyX: string,
	dataKeyY: string,
	tooltipFormatter: (v: number) => string
}) {
	return (
		<div className='relative w-full'>
			<div className='bg-[#78d369]/7 h-[5px] w-full absolute bottom-0'></div>
			<ResponsiveContainer width='100%' height={360}>
				<AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
					<defs>
						<linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="#ffe600" />
							<stop offset="100%" stopColor="#00faff" />
						</linearGradient>
					</defs>

					<XAxis dataKey={dataKeyX} hide />
					<YAxis dataKey={dataKeyY} hide />

					<Tooltip
						formatter={tooltipFormatter}
						content={({ active, payload, label }: TooltipProps<number, string>) =>
							active && payload && payload.length ? (
								<div className="border-br-card ring-3 rounded-lg border-2 bg-white/10 p-2 ring-white/5 backdrop-blur-xs">
									<p>{label}</p>
									<p className="text-xl capitalize">
										{tooltipFormatter(payload[0].value as number)}
									</p>
								</div>
							) : null
						}
					/>

					<Area
						dataKey={dataKeyY}
						type="monotone"
						stroke="url(#colorGradient)"
						strokeWidth={3}
						fill="#78d369"
						fillOpacity="7%"
						animationBegin={1000}
						animationDuration={1500}
						animationEasing="ease-in-out"
					/>
				</AreaChart>
			</ResponsiveContainer>

		</div>
	);
}
