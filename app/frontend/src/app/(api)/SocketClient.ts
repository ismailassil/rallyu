import { io, Socket } from "socket.io-client";

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on(event: string, handler: (...args: any[]) => void) {
		this.socket?.on(event, handler);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off(event: string, handler: (...args: any[]) => void) {
		this.socket?.off(event, handler);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emit(event: string, data: any) {
		this.socket?.emit(event, data);
	}

	disconnect() {
		this.socket?.disconnect();
		this.socket?.on("disconnect", () => {
			console.log("[SocketIO] Disconnected");
		});
	}

	/** Function Handlers */
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

	emitGameResponse(targetId: number, accept: boolean, actionUrl: string) {
		const data = {
			eventType: "UPDATE_GAME",
			data: {
				receiverId: targetId,
				type: accept ? "game_accept" : "game_reject",
				actionUrl,
			},
		};

		this.emit("notification", data);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	printAll(data: any) {
		console.group("-------------NOTIFICATION-------------");
		console.log(data);
		console.groupEnd();
	}
}

export default SocketClient;
