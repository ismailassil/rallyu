export default function LeaderboardItem({ username, rank, score, img }) {
	return (
		<div className="flex bg-card border-2 border-br-card rounded-xl hover:bg-hbg hover:border-hbbg hover:scale-101 transition-transform duration-200 p-3 items-center overflow-hidden">
			{/* Rank Badge */}
			<div className="flex w-[40px] h-[40px] rounded-full bg-gradient-to-br from-purple-500 to-blue-600 justify-center items-center text-white font-bold text-xl">
				{rank}
			</div>

			{/* Profile Image */}
			<div className="ml-3 flex w-[55px] h-[55px] rounded-full justify-center">
				<Image
					className="h-full w-full object-cover rounded-full ring-fr-image ring-2"
					src={img}
					width={100}
					height={100}
					alt="Profile Image"
				/>
			</div>

			{/* Middle Content */}
			<div className="ml-5 flex-grow">
				<h2 className="text-xl capitalize">{username}</h2>
				<p className="text-gray-500">
					Score: <span className="text-yellow-400 font-semibold">{score}</span>
				</p>
			</div>

			{/* Actions */}
			<div className="flex gap-1">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
					Profile
				</button>
				<Image
					className="hover:ring-2 hover:ring-br-card hover:rounded-full hover:cursor-pointer"
					src="/trophy-icon.svg"
					width={50}
					height={50}
					alt="Trophy Icon"
				/>
			</div>
		</div>
	);
}
