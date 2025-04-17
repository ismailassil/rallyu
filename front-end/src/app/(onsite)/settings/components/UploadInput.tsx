import { Trash, UploadSimple } from "@phosphor-icons/react";

function UploadInput() {
	return (
		<div className="flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base">
			<label className="w-full flex-1" htmlFor="picture">
				Profile Picture
			</label>
			<div className="flex-2 w-full">
				<div className="relative flex justify-between gap-10">
					<input type="file" id="picture" name="picture" accept=".jpg, .jpeg, .png" className="hidden" />
					<label
						htmlFor="picture"
						className="bg-main hover:scale-101 flex transform cursor-pointer 
								items-center gap-3 rounded-md px-6 py-2 text-white duration-300"
					>
						<UploadSimple size={20} />
						Update Picture
					</label>
					<button
						className="hover:scale-101 border-1 flex transform 
								cursor-pointer items-center gap-3 rounded-md border-white/20 px-6 py-2
								text-white ring-white/20 duration-300 hover:bg-white/5 hover:ring-1"
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
