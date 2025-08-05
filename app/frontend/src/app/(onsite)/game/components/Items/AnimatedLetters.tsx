const AnimatedLetters = ({ text, trigger }: { text: string, trigger: boolean }) => {
    return (
		<>
			{text.split('').map((char, i) => (
				<span
				key={i}
				className={`
				inline-block
				transition-all duration-150
				${trigger
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
		</>
    )
}

export default AnimatedLetters