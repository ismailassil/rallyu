import Slot from "./Slot";

const BracketViewDesktop = function ({ matches }) {

    return (
        <div className="sm:block hidden">
            <div className="mb-8 flex justify-evenly font-extralight">
                <p>Semi-final</p>
                <p>Final</p>
            </div>
            <div className="flex w-full items-center justify-center mb-4">
                <div className="max-w-3xs mr-[41px] md:mr-[81px] flex w-full flex-col gap-14">
                    <Slot match={matches[0]} />
                    <Slot match={matches[1]} />
                </div>
                <div className="h-[157px] w-px bg-gray-300 opacity-20"></div>
                <div className="max-w-3xs ml-[41px] md:ml-[81px] ml flex w-full flex-col gap-14">
                    <Slot match={matches[2]} reverse={1} />
                </div>
            </div>
        </div>
    );
};

export default BracketViewDesktop;