const FooterFinished = function (
    { winner }:
    { winner: string }
) {

    return (
        <div className="self-stretch sm:self-center flex gap-2 items-center justify-center">
            <span className="text-4xl">&#129351;</span>
            <div className="w-full bg-yellow-500 px-10 py-4 rounded-lg text-center">
                <p className="uppercase font-black text-gray-100">
                    Winner is
                    <span className="ml-2 text-yellow-700 underline hover:cursor-pointer">{ winner }</span>
                </p>
            </div>
        </div>
    );
};

export default FooterFinished;