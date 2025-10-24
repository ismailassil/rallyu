import { io, Socket } from "socket.io-client";
import { GameType } from "../(onsite)/game/types/types";
import {
	NOTIFICATION_STATE,
	NOTIFICATION_STATUS,
	NOTIFICATION_TYPE,
} from "../(onsite)/components/Header/notification/types/notifications.types";

class SocketClient {
	private socket: Socket;
	private BaseURL!: string;

	constructor(origin: string) {
		this.BaseURL = origin.replace("/^http/", "ws");

		this.socket = io(this.BaseURL, {
			autoConnect: false,
			reconnection: true,
			withCredentials: true,
			transports: ["polling"],
			path: "/socketio-api",
		});
	}

	connect(accessToken: string) {
		if (this.socket.connected) return;
		this.socket.auth = { token: accessToken };

		this.socket.connect();

		/** Logs */
		this.socket.on("connect", () => {
			console.log(
				"[SocketIO] Connected | Transport: " + this.socket.io.engine.transport.name
			);
		});

		this.socket.on("connect_error", (err) => {
			console.log("ERROR: [SocketIO] Connection Error:", err.message);
		});
	}

	get instance() {
		if (!this.socket) throw new Error("Socket not connected yet!");
		return this.socket;
	}

	on(event: string, handler: (...args: any[]) => void) {
		this.socket?.on(event, handler);
	}

	off(event: string, handler: (...args: any[]) => void) {
		this.socket?.off(event, handler);
	}

	emit(event: string, data: any) {
		this.socket?.emit(event, data);
	}

	disconnect() {
		this.socket?.disconnect();
		this.socket?.on("disconnect", () => {
			console.log("[SocketIO] Disconnected");
		});
	}

	/******************** */
	/** Function Handlers */
	/******************** */

	createGame(targetId: number, gameType: "pingpong" | "tictactoe") {
		const data = {
			eventType: "CREATE_GAME",
			data: {
				targetId,
				type: gameType === "pingpong" ? "pp_game" : "xo_game",
			},
		};

		this.emit("notification", data);
	}

	emitGameResponse(targetId: number, accept: boolean, actionUrl: string, type: GameType) {
		const data = {
			eventType: "UPDATE_GAME",
			data: {
				receiverId: targetId,
				type: !accept ? "game_reject" : type,
				actionUrl,
			},
		};

		this.emit("notification", data);
	}

	updateContext(type: NOTIFICATION_TYPE) {
		const data = {
			eventType: "UPDATE_CONTEXT",
			data: {
				type,
			},
		};

		this.emit("notification", data);
	}

	emitUpdateAction(
		updateAll: boolean,
		data: { id?: number; status: NOTIFICATION_STATUS; state?: NOTIFICATION_STATE }
	) {
		let payload: any;
		const eventType = "UPDATE_ACTION";

		if (!updateAll) {
			payload = {
				eventType,
				data: {
					updateAll: false,
					notificationId: data.id,
					status: data.status,
					state: data.state,
				},
			};
		} else {
			payload = {
				eventType,
				data: {
					status: data.status,
				},
			};
		}

		this.emit("notification", payload);
	}

	printAll(data: any) {
		console.group("-------------NOTIFICATION-------------");
		console.log(data);
		console.groupEnd();
	}
}

export default SocketClient;
