import { useRouter } from "next/navigation";

const X = () => {
    const router = useRouter();

    const handleClick = async () => {
        router.push('/game/tictactoe/local');
    }

    return (
        <div
            className="absolute inset-0 rounded-xl transition-all duration-150 hover:bg-gray-300/[6%] bg-card hover:scale-[101%] active:scale-[99%] cursor-pointer [clip-path:polygon(55%_0,100%_0,100%_100%,45%_100%)]"
            onClick={handleClick}
            style={{
                fontFamily: 'Serious2b',
            }}
        >
			<span className={`flex text-4xl uppercase justify-end`}>
                LOCAL PLAY
            </span>
		</div>
    )
}

export default X;