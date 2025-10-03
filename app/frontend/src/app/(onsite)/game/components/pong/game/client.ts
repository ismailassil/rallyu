import { APIClient } from '@/app/(api)/APIClient';
import type { GameState, MessageCallBack } from "../types/GameTypes"

class SocketProxy {
	private static instance: SocketProxy;
	private socket: WebSocket | null = null;
	private subscribers: MessageCallBack[] = [];

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

	public connect(
		url: string,
		api: APIClient,
		setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
		setGameTime: React.Dispatch<React.SetStateAction<number>>
	): (() => void) {
		this.socket = api.connectWebSocket(url);
		this.socket.onopen = (): void => {
			setGameStarted(true);
			console.log('Connected to Pong Server');
		}

		this.socket.onmessage = (message: MessageEvent): void => {
			this.notifySubscribers(message.data);
		}

		this.socket.onclose = (event: CloseEvent): void => {
			console.log("Disconnected from Pong Websocket");
			setGameStarted(false);
			setGameTime(0);
			console.log(event.reason);
			return;
		}

		this.socket.onerror = (error: Event): void => {
			console.error("WebSocket error: ", error);
		}
		return this.disconnect.bind(this);
	}

	public disconnect(): void {
		this.socket?.close(1000, "Normal");
		this.socket = null;
	}

	public send(message: any): void {
		if (!this.isConnected()) return;

		this.socket!.send(message);
	}

	public isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN;
	}
}

export const setupCommunications = (
	gameStateRef: React.RefObject<GameState>,
	proxy: SocketProxy,
	setGameTime: React.Dispatch<React.SetStateAction<number>>
): (() => void) => {
	return proxy.subscribe((data: any): void => {
		gameStateRef.current.gameStatus = data.type
		switch (data.type) {
			case 'opp_left':
				gameStateRef.current.opponentDC = true;
				break;
			case 'opp_joined':
				gameStateRef.current.opponentDC = false;
				break;
			case 'reconnected':
				gameStateRef.current.index = data.i;
				gameStateRef.current.players[0].score = data.score[0]
				gameStateRef.current.players[1].score = data.score[1]
				setGameTime(data.time);
				break;
			case 'gameover':
				gameStateRef.current.serverBall = { x: 800, y: 600, width: 20, height: 20 };
				proxy.disconnect();
				setGameTime(0);
				break;
			case 'ready':
				gameStateRef.current.index = data.i
				setGameTime(3);
				break;
			case 'start':
				setGameTime(90);
				break;
			case 'state':
				gameStateRef.current.serverBall = data.state.b
				if (gameStateRef.current.index === 1)
					gameStateRef.current.serverBall.x = 1600 - gameStateRef.current.serverBall.x;
				gameStateRef.current.serverPlayerY = data.state.p
				gameStateRef.current.players[0].score = data.state.s[0]
				gameStateRef.current.players[1].score = data.state.s[1]
				break;
		}
	})
}

export default SocketProxy
