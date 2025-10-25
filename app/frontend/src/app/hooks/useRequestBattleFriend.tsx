import { useAuth } from "../(onsite)/contexts/AuthContext";

let timer: NodeJS.Timeout | undefined;

const useRequestBattleFriend = function () {
    const { isBusy, setIsBusy, socket } = useAuth();

    const requestBattleFriend = function (event: any, targetId: number | undefined, gameType: "pingpong" | "tictactoe") {
		event.preventDefault();
		if (isBusy || typeof targetId !== 'number')
			return ;
	
		socket.createGame(targetId, gameType);
		setIsBusy(true);
		clearTimeout(timer);
		timer = setTimeout(() => {
			setIsBusy(false);
		}, 10000);
	};

    return requestBattleFriend;
};

export default useRequestBattleFriend;