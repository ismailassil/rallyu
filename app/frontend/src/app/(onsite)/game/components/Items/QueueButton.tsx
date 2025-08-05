import { useState } from "react"
import AnimatedLetters from "./AnimatedLetters";

function QueueButton() {
	const [ clicked, setClicked ] = useState(false);

	const onClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		setClicked(!clicked);
		// connect to match maker
	}

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