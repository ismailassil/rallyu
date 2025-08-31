import AnimateLink from "./AnimateLink";

const FooterFinished = function (
    { winner }:
    { winner: string }
) {

    return (
        <div className="self-stretch sm:self-center flex gap-1.5 items-center justify-center">
            <span className="md:text-3xl text-2xl">&#129351;</span>
            <AnimateLink
                color="bg-yellow-700"
                url={`/users/${winner}`}
            >
                <p className="font-black text-gray-100">
                    <span className="text-yellow-700 hover:cursor-pointer md:text-5xl text-4xl tracking-tight">{ winner }</span>
                </p>
            </AnimateLink>
        </div>
    );
};

export default FooterFinished;