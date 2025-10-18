'use client';

export default function LoadingSkeletonList({
	skeletonItem,
	count = 10
} : {
	skeletonItem: React.ReactNode
	count: number,
}) {

	return (
	  <div className="flex flex-col gap-3">
			{Array.from({ length: count }, (_, index) => (
				<div key={index}>{skeletonItem}</div>
			))}
	  </div>
	);
}
