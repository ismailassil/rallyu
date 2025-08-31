import Slot from "./Slot";

const BracketViewMobile = function ({ matches }) {

    return (
        <div className="sm:hidden">
            <p className="text-center mb-4">Semi-final</p>
            <div className="flex w-full flex-col gap-7 mb-8">
                <Slot match={matches[0]} />
                <Slot match={matches[1]} />
            </div>
            <p className="text-center mb-4">Final</p>
            <div className="flex w-full flex-col gap-7 mb-4">
                <Slot match={matches[2]} reverse={1} />
            </div>
        </div>
    );
};

export default BracketViewMobile;