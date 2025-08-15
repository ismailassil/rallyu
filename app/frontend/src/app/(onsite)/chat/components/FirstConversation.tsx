import React from "react";

const LoadingChat = () => {
  const letters = ["l", "o", "a", "d", "i", "n", "g"];
  const delays = [100, 250, 400, 550, 700, 850, 1000];

  return (
    <div className="loading-chat flex text-[30px] m-auto">
      {letters.map((letter, i) => (
        <span
          key={i}
          style={{ "--d": `${delays[i]}ms` } as React.CSSProperties}
          className="flex items-center justify-center capitalize font-sans font-bold text-[#aa41fe] rounded-lg min-w-[40px]"
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default LoadingChat;
