import Image from "next/image";

function ProfileHead({ img }: { img?: string | null | undefined }) {
	return (
		<div className="min-w-10 aspect-square h-full overflow-hidden rounded-full">
			<Image
				src={img || "/profile/blank.jpeg"}
				width={300}
				height={300}
				alt="Profile Image"
				className={`h-full w-full object-cover ${!img && "animate-pulse opacity-60"}`}
			/>
		</div>
	);
}

export default ProfileHead;
