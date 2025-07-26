import { MessageType } from './database.types';

export interface NatsOptions {
	NATS_PORT: string;
	NATS_USER: string;
	NATS_PASSWORD: string;
}

export interface IChatPayload {
	sender: string;
	receiver: string;
	data: IMessagePayload;
}

export interface ISocketPayload {
	sender: string;
	receiver: string;
	data: MessageType;
}

export interface IMessagePayload {
	message: 'string';
	sent_at: 'string';
}

export interface INotifyBody {
	from_user: string;
	to_user: string;
	type: 'chat';
	msg?: string;
	action_url?: string;
}
