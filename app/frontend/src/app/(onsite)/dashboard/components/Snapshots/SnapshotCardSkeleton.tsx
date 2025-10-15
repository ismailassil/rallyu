export function SnapshotSkeleton() {
	return (
		<div className="px-6 animate-pulse select-none">
			{/* Match Card Skeleton */}
			{/* <div className="h-28 bg-white/2 border border-white/8 rounded-2xl w-full mb-4"></div> */}

			<div className="flex flex-col gap-4">
				{/* Record Stat Skeleton */}
				<div className="h-16 bg-white/2 border border-white/8 rounded-2xl w-full p-4 flex justify-between">
					<div className="flex flex-col gap-2">
						<div className="h-4 lg:h-5 w-28 bg-white/10 rounded" />
						<div className="h-3 w-16 bg-white/10 rounded" />
					</div>
					<div className="h-8 w-16 bg-white/10 rounded-lg" />
				</div>

				{/* Totals and Scores Skeleton */}
				<div className="flex w-full gap-4">
					<div className="flex-1 h-20 bg-white/2 border border-white/8 rounded-2xl p-4 flex justify-between items-center">
						<div className="flex flex-col gap-2">
							<div className="h-4 lg:h-5 w-28 bg-white/10 rounded" />
							<div className="h-3 w-16 bg-white/10 rounded" />
						</div>
						<div className="h-8 w-16 bg-white/10 rounded-lg" />
					</div>
					<div className="flex-1 h-20 bg-white/2 border border-white/8 rounded-2xl p-4 flex justify-between items-center">
						<div className="flex flex-col gap-2">
							<div className="h-4 lg:h-5 w-28 bg-white/10 rounded" />
							<div className="h-3 w-16 bg-white/10 rounded" />
						</div>
						<div className="h-8 w-16 bg-white/10 rounded-lg" />
					</div>
				</div>

				{/* Duration Skeleton */}
				<div className="h-16 bg-white/2 border border-white/8 rounded-2xl w-full p-4 flex justify-between">
					<div className="flex flex-col gap-2">
						<div className="h-4 lg:h-5 w-28 bg-white/10 rounded" />
						<div className="h-3 w-16 bg-white/10 rounded" />
					</div>
					<div className="h-8 w-16 bg-white/10 rounded-lg" />
				</div>

				{/* Chart Skeleton */}
				<div className="h-110 bg-white/2 border border-white/8 rounded-2xl w-full flex justify-center p-4">
					<div className="h-5 lg:h-7 w-72 bg-white/10 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
