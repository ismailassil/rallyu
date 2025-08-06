import type { GameState, MessageCallBack } from "../types/GameTypes"

const MAX_RETRIES = 3;

class SocketProxy {
	private static instance: SocketProxy;
	private socket: WebSocket | null = null;
	private subscribers: MessageCallBack[] = [];
	private url: string | null = null;
	private retryAttemts: number = 0;
	private destroyed: boolean = false;


	private constructor() {};

	public static getInstance(): SocketProxy {
		if (!SocketProxy.instance) {
			SocketProxy.instance = new SocketProxy;
		}
		return SocketProxy.instance;
	}

	private notifySubscribers(message: any) {
		try {
			const data = JSON.parse(message);
			this.subscribers.forEach(sub => sub(data));
		} catch (e) {
			console.error("Unable to parse Data from WebSocket: ", message);
		}
	}

	public subscribe(callback: MessageCallBack): () => void {
		this.subscribers.push(callback);
		return () => {
			this.subscribers = this.subscribers.filter(cb => cb !== callback);
		}
	}

	public connect(url: string): (() => void) {
		this.url = url;
		this.socket = new WebSocket(url);

		this.socket.onopen = (): void => {
			console.log('Connected to Pong Server');
		}

		this.socket.onmessage = (message: MessageEvent): void => {
			this.notifySubscribers(message.data);
		}

		this.socket.onclose = (event: CloseEvent): void => {
			console.log("Disconnected from Pong Websocket");
			if (event.code === 1000) // normal disconnection
				return;

			if (this.retryAttemts >= MAX_RETRIES) {
				console.warn("Max retry attemts reached.");
				return;
			}

			console.log("Reconnecting...");
			setTimeout(() => this.reconnect(), 5000); // reconnect after 5 seconds
			this.retryAttemts++;
		}

		this.socket.onerror = (error: Event): void => {
			console.error("WebSocket error: ", error);
		}
		return this.disconnect.bind(this);
	}

	private reconnect(): void {
		if (this.url && !this.destroyed)
			this.connect(this.url);
	}

	public disconnect(): void {
		this.destroyed = true;
		this.socket?.close(1000, "Normal");
	}

	public send(message: any): void {
		if (!this.isConnected()) return;

		this.socket!.send(message);
	}

	public isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN;
	}
}

export const setupCommunications = (gameStateRef: React.RefObject<GameState>, proxy: SocketProxy): (() => void) => {
	return proxy.subscribe((data: any): void => {
		switch (data.type) {
			case 'waiting':
				gameStateRef.current.gameStatus = 'waiting'
				break;
			case 'ready':
				gameStateRef.current.gameStatus = 'ready'
				gameStateRef.current.index = data.i
				break;
			case 'start':
				gameStateRef.current.gameStatus = 'playing'
				break;
			case 'state':
				gameStateRef.current.serverBall = data.state.b
				if (gameStateRef.current.index === 1)
					gameStateRef.current.serverBall.x = 800 - gameStateRef.current.serverBall.x;
				gameStateRef.current.serverPlayerY = data.state.p
				gameStateRef.current.players[0].score = data.state.s[0]
				gameStateRef.current.players[1].score = data.state.s[1]
				break;
		}
	})
}

export default SocketProxy
