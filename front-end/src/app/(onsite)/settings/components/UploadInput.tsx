import { Trash, UploadSimple } from "@phosphor-icons/react";

function UploadInput() {
	return (
		<div className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-20 text-sm lg:text-base">
			<label className="flex-1 w-full" htmlFor="picture">
				Profile Picture
			</label>
			<div className="flex-2 w-full">
				<div className="flex justify-between gap-10 relative">
					<input
						type="file"
						id="picture"
						name="picture"
						accept=".jpg, .jpeg, .png"
						className="hidden"
					/>
					<label
						htmlFor="picture"
						className="bg-main text-white hover:scale-101 transform duration-300 
								py-2 px-6 rounded-md cursor-pointer flex gap-3 items-center"
					>
						<UploadSimple size={20} />
						Update Picture
					</label>
					<button
						className="text-white hover:scale-101 transform duration-300 
								py-2 px-6 rounded-md cursor-pointer border-1 border-white/20 hover:bg-white/5
								hover:ring-1 ring-white/20 flex gap-3 items-center"
					>
						<Trash size={20} />
						<p className="block md:hidden lg:block">Remove Picture</p>
					</button>
				</div>
			</div>
		</div>
	);
}

export default UploadInput;
