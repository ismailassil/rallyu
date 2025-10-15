import { CastleTurretIcon, CrownSimpleIcon } from "@phosphor-icons/react";
import { CrownIcon } from "lucide-react";

export function LoadingSkeletonList({
	count = 10
} : {
	count: number,
}) {

	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: count }, (_, index) => (
				<Skeleton key={index} position={index} />
			))}
		</div>
	);
}


function Skeleton({ position }: { position: number }) {
	return (
		<div className="flex bg-white/2 border border-white/8 rounded-2xl py-4 px-5 justify-between items-center select-none animate-pulse">
			{/* LEFT SECTION */}
			<div className="flex gap-5 items-center">
				{/* RANK BADGE */}
				<div
					className="flex items-center justify-center text-xl font-bold text-notwhite text-center
						h-[40px] w-[30px] lg:h-[45px] lg:w-[35px] lg:text-2xl"
				>
					{position === 0 && (
						<CrownIcon color="oklch(82.8% 0.189 84.429)" size={30} />
					)}
					{position === 1 && (
						<CrownSimpleIcon color="oklch(82.8% 0.189 84.429)" size={30} />
					)}
					{position === 2 && (
						<CastleTurretIcon color="oklch(82.8% 0.189 84.429)" size={30} />
					)}
					{position > 2 && position}
				</div>

				{/* PROFILE IMAGE */}
				<div className="flex h-[40px] w-[40px] items-center justify-center rounded-full lg:h-[45px] lg:w-[45px] bg-white/10" />

				{/* MIDDLE CONTENT */}
				<div className="flex flex-col gap-2">
					<div className="h-4 lg:h-5 w-28 bg-white/10 rounded" />
					<div className="h-3 w-16 bg-white/10 rounded" />
				</div>
			</div>

			{/* SCORE SKELETON */}
			<div className="h-8 w-16 bg-white/10 rounded-lg" />
		</div>
	  );
}
