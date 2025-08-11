import { useState } from "react"
import AnimatedLetters from "./AnimatedLetters";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

function QueueButton() {
	const { user, api } = useAuth();
	const [ clicked, setClicked ] = useState(false);

	const onClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		e.preventDefault();
		try {
			// connect to match maker
			if (!clicked) {
				const res = await api.instance.post("/v1/matchmaking/join", { id: user?.id });
				console.log(res);

				
			}
			setClicked(!clicked);
		} catch (err: unknown) {
			console.error(err);
		}
	};

	return (
		<button
			onClick={onClick}
		  className="mt-auto rounded-full py-[1.2rem] px-[3rem]
			bg-black text-white uppercase font-black cursor-pointer overflow-hidden
			relative group box-border"
		>
		  <div className={`grid inset-0 absolute text-black bg-white  
			${clicked ? 'translate-y-full': ''}
			transform transition-transform duration-150`
			}>
			<span className=" w-full h-full content-center scale-100 group-hover:scale-110 transform transition-transform duration-300">
				Queue
			</span>
		  </div>
		  <div className="inline-flex">
			<AnimatedLetters text="In Queue" trigger={clicked} />
		  </div>
		</button>
	  )
}

export default QueueButton