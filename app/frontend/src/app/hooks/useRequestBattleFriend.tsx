import { useAuth } from "../(onsite)/contexts/AuthContext";

let timer: NodeJS.Timeout | undefined;

const useRequestBattleFriend = function () {
    const { isBusy, setIsBusy } = useAuth();

    const requestBattleFriend = function (event) {
		event.preventDefault();
		if (isBusy)
			return ;
	
		setIsBusy(true);
		clearTimeout(timer);
		timer = setTimeout(() => {
			setIsBusy(false);
		}, 10000);
	};

    return requestBattleFriend;
};

export default useRequestBattleFriend;