import unicaOne from "@/app/fonts/unicaOne";

const Versus = () => {
    return (
        <div className="w-full h-45 flex border border-white/10 bg-white/2 rounded-lg mb-3">
            <div className={`w-full h-full flex items-center pl-3
            `}>
                <img src="https://pbs.twimg.com/media/GlOfMqRXsAAvcHc.jpg" alt="player1" className="border border-white/50 lg:h-20 lg:w-20 h-15 w-15" />
                <span className={`${unicaOne.className} lg:text-4xl text-2xl italic ml-2 uppercase`}>Player1</span>
            </div>



            <div className="atari-score w-full h-full pr-3 text-7xl flex justify-end items-center">
                <span className={`${unicaOne.className} lg:text-4xl text-2xl italic mr-2 uppercase`}>Player2</span>
                <img src="https://pbs.twimg.com/media/GlOfMqRXsAAvcHc.jpg" alt="player1" className="border border-white/50 lg:h-20 lg:w-20 h-15 w-15" />
            </div>
        </div>
    );
}

export default Versus