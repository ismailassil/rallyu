import { Circle, X } from "lucide-react"
import { XOSign } from "../../types/types"


const TurnIndicator = ({ indicator, currentPlayer }: { indicator: XOSign, currentPlayer: XOSign }) => {
    return (
        <div className={`flex w-[26px] justify-center items-center h-[26px] rounded-full transition-all duration-200 ${currentPlayer === indicator ? 'animate-pulse bg-green-500 opacity-100' : 'opacity-40 bg-white'}`}>
            {indicator === 'X'
            ? <X className="w-2/3 h-2/3" color="black" />
            : <Circle className="w-2/3 h-2/3" color="black" />}
        </div>
    )
}

export default TurnIndicator