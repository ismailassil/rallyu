import { useAuth } from "../(onsite)/contexts/AuthContext";

let timer: NodeJS.Timeout | undefined;

const useRequestBattleFriend = function () {
    const { isBusy, setIsBusy } = useAuth();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestBattleFriend = function (event: any) {
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