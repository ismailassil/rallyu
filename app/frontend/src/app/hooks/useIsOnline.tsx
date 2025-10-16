import { usePresence } from "../(onsite)/contexts/PresenceContext";

export default function useIsOnline(userID: number) {
	const {
		onlineUsers
	} = usePresence();
	return onlineUsers.has(userID);
}
