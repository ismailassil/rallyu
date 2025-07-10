import { MessageTypes } from './database.types';

export interface ReturnFetchChatsTypes {}

export interface ParamsFetchChatsTypes {
	username: string;
}

export interface QueryFetchChatsTypes {
	page: number;
}

export interface ApiResponseSuccess {
	status: string;
	message: string;
	data: MessageTypes[] | null;
}

export interface ApiResponseError {
	status: string;
	message: string;
	error: object | string;
}
