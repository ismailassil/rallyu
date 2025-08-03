import { useState } from "react"

interface Toggle {
	onToggle: ((clicked: boolean) => void) | null;
}

function QueueButton({ onToggle }: Toggle) {
	const [ clicked, setClicked ] = useState(false);

	const onClick = () => {
		setClicked(!clicked);
		if (onToggle) {
			onToggle(!clicked);
		}
	}

	return (
		<button
			onClick={onClick}
		  className="shadow-inner rounded-full py-[1.2rem] px-[3rem]
			bg-black text-white uppercase font-black cursor-pointer self-center overflow-hidden
			relative group box-border"
		>
		  <div className={`grid content-center inset-0 absolute text-black bg-white  
			${clicked ? 'translate-y-full': ''}
			transform transition-transform duration-150`
			}>
			Queue
		  </div>
		  <div className="inline-flex">
			{"In Queue".split('').map((char, i) => (
			  <span
			  key={i}
			  className={`
				inline-block
				transition-all duration-150
				${clicked
					? 'translate-y-0 opacity-100 [transition-delay:var(--hover-delay)]'
					: `${i % 2 === 0 ? '-translate-y-[15px]' : 'translate-y-[15px]'} opacity-0`}
			  `}
			  style={{
				'--hover-delay': `${i * 30}ms`
			  } as React.CSSProperties}
			>
			  {char === ' ' ? "\u00A0" : char}
			</span>
			))}
		  </div>
		</button>
	  )
}

export default QueueButton