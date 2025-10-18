import { APIClient } from '@/app/(api)/APIClient';

type MessageCallBack = (message: any) => void;

class SocketProxy {
	private socket: WebSocket | null = null;
	private subscribers: MessageCallBack[] = [];

	constructor() {};

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
		api: APIClient
	): (() => void) {
		this.socket = api.connectWebSocket(url);
		this.socket.onopen = (): void => {
			console.log('Connected to Pong Server');
		};

		this.socket.onmessage = (message: MessageEvent): void => {
			this.notifySubscribers(message.data);
		}

		this.socket.onclose = (event: CloseEvent): void => {
			console.log("Disconnected from Pong Websocket", event.reason);
			return;
		}

		this.socket.onerror = (error: Event): void => {
			console.error("WebSocket error: ", error);
		}
		return this.disconnect.bind(this);
	}

	public disconnect(): void {
		console.log('Disconnect Called');
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

export default SocketProxy