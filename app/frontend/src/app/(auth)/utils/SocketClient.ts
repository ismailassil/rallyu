import { io, Socket } from "socket.io-client";

class SocketClient {
	private socket: Socket;
	private BaseURL: string = "ws://localhost:4025";

	constructor() {
		this.socket = io(this.BaseURL, {
			autoConnect: false,
			reconnection: false,
			withCredentials: true,
		});
	}
	
	connect(accessToken: string) {
		this.socket.auth = { token: accessToken };

		this.socket.connect();

		/** Logs */
		this.socket.on("connect", () => {
			console.log("[SocketIO] Connected");
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
	on(event: string, handler: (...args: any[])=> void) {
		this.socket?.on(event, handler);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	off(event: string, handler: (...args: any[])=> void) {
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
}

export default SocketClient;