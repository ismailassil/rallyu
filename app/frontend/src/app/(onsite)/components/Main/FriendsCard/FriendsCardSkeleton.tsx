
export function LoadingSkeletonList({
	count = 10
} : {
	count: number,
}) {

	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: count }, (_, index) => (
				<Skeleton key={index} />
			))}
		</div>
	);
}

function Skeleton() {
	return (
		<div className="flex bg-white/2 border border-white/8 rounded-2xl py-4 px-5 justify-between items-center select-none animate-pulse">
		  	{/* LEFT SECTION */}
			<div className="flex gap-5 items-center">
				{/* AVATAR SKELETON */}
				<div className="h-[40px] w-[40px] rounded-full bg-white/10" />
				{/* TEXT SKELETON */}
				<div className="flex flex-col gap-2">
					<div className="h-4 w-28 bg-white/10 rounded" />
					<div className="h-3 w-16 bg-white/10 rounded" />
				</div>
		  	</div>

		 	{/* BUTTONS SKELETON */}
			<div className="flex gap-3">
				<div className="w-10 h-10 rounded-full bg-white/10" />
				<div className="w-10 h-10 rounded-full bg-white/10" />
			</div>
		</div>
	);
}
