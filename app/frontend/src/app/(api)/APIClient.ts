/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import { UserService } from './services/UserService';
import { AuthService } from './services/AuthService';
import { MfaService } from './services/MfaService';
import { VerifyService } from './services/VerifyService';
import { GameType } from '../(onsite)/game/types/PongTypes';

export type APIError = {
	code: string;
	message: string;
	details?: any;
}

export type PlayerState = {
	ID: number;
	score: number;
	coords?: any;
};

export type RemotePlayerStatus = {
	roomId: string,
	opponentId: number,
	gameType: GameType,
}

export type GameRoomStatus =
	| {
		gameType: 'pingpong' | 'tictactoe',
		cells: any[];
		currentRound: number;
		players: PlayerState[];
	  }
	| {
		gameType: 'pingpong' | 'tictactoe',
		ball: any;
		players: PlayerState[];
	  };

export class APIClient {
	private client: AxiosInstance;
	private accessToken: string = '';
	private isRefreshing: boolean = false;
	private failedQueue: any[] = [];

	// Service instances
	public user: UserService;
	public auth: AuthService;
	public mfa: MfaService;
	public verify: VerifyService;

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			withCredentials: true,
		});

		this.user = new UserService(this.client);
		this.auth = new AuthService(this.client, accessToken => this.setAccessToken(accessToken));
		this.mfa = new MfaService(this.client);
		this.verify = new VerifyService(this.client);

		this.client.interceptors.request.use(config => {
			console.log('in interceptor, accessToken: ', this.accessToken);
			if (this.accessToken) {
				config.headers.Authorization = `Bearer ${this.accessToken}`;
			}
			return config;
		});

		this.client.interceptors.response.use(
			res => res,
			err => this.handleResponseError(err)
		);
	}

	private processQueue(error: any, token: string | null) {
		console.log('APIClient::processQueue();');
		this.failedQueue.forEach(prom => {
			if (token) prom.resolve(token);
			else prom.reject(error);
		});
		this.failedQueue = [];
	}

	private async handleResponseError(err: any) {
		console.log('APIClient::handleResponseError();');
		const originalRequest = err.config;

		console.log('Error: ', err);
		console.log('Response status: ', err.response?.status);
		console.log('_retry: ', originalRequest._retry);
		console.log('isRefreshing: ', this.isRefreshing);
		console.log('failedQueue: ', this.failedQueue);
		if (err.response?.status === 401 && !originalRequest._retry && this.accessToken) {
			if (this.isRefreshing) {
				console.log('pushing to failed queue');
				return new Promise((resolve, reject) => {
					this.failedQueue.push({
						resolve: (token: string) => {
							originalRequest.headers.Authorization = `Bearer ${token}`;
							resolve(this.client(originalRequest));
						},
						reject: (e: any) => reject(e),
					});
				});
			}

			originalRequest._retry = true;
			this.isRefreshing = true;

			try {
				const { data } = await this.client.get('/auth/refresh');
				this.setAccessToken(data.data.accessToken);
				this.processQueue(null, data.accessToken);
				originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
				return this.client(originalRequest);

			} catch (refreshError: any) {
				console.log('refreshError: ', refreshError);
				this.processQueue(refreshError, null);
				throw this.classifyError(refreshError);
				// return Promise.reject(refreshError);

			} finally {
				this.isRefreshing = false;
			}
		}

		throw this.classifyError(err);
		// return Promise.reject(err);
	}

	setAccessToken(token: string) {
		this.accessToken = token;
	}

	get instance(): AxiosInstance {
		return this.client;
	}

	// Proxy methods to maintain backward compatibility
	/*--------------------------------- Users Profiles ---------------------------------*/

	async fetchUser(id: number) {
		return this.user.fetchUser(id);
	}

	async fetchUserByUsername(username: string) {
		return this.user.fetchUserByUsername(username);
	}

	async fetchUserMatchesPage(id: number, options?: any) {
		return this.user.fetchUserMatchesPage(id, options);
	}

	async fetchUserAnalytics(id: number) {
		return this.user.fetchUserAnalytics(id);
	}

	async fetchUserAnalyticsByDay(id: number) {
		return this.user.fetchUserAnalyticsByDay(id);
	}

	async fetchLeaderboard() {
		return this.user.fetchLeaderboard();
	}

	async searchUsersByQuery(username: string) {
		return this.user.searchUsersByQuery(username);
	}

	async getUserAvatarBlob(url: string) {
		return this.user.getUserAvatarBlob(url);
	}

	async updateUserAvatar(id: number, avatarFile: FormData) {
		return this.user.updateUserAvatar(id, avatarFile);
	}

	async updateUser(id: number, payload: { first_name?: string, last_name?: string, username?: string, email?: string, bio?: string }) {
		return this.user.updateUser(id, payload);
	}

	/*--------------------------------- Users Relations ---------------------------------*/

	async getAllFriends() {
		return this.user.fetchFriends();
	}

	async getAllBlocked() {
		return this.user.fetchBlocked();
	}

	async getAllIncomingFriendRequests() {
		return this.user.fetchIncomingFriendRequests();
	}

	async getAllOutgoingFriendRequests() {
		return this.user.fetchOutgoingFriendRequests();
	}

	async sendFriendRequest(user_id: number) {
		return this.user.sendFriendRequest(user_id);
	}

	async cancelFriendRequest(user_id: number) {
		return this.user.cancelFriendRequest(user_id);
	}

	async acceptFriendRequest(user_id: number) {
		return this.user.acceptFriendRequest(user_id);
	}

	async rejectFriendRequest(user_id: number) {
		return this.user.rejectFriendRequest(user_id);
	}

	async blockUser(user_id: number) {
		return this.user.block(user_id);
	}

	async unblockUser(user_id: number) {
		return this.user.unblock(user_id);
	}

	async unfriend(user_id: number) {
		return this.user.unfriend(user_id);
	}

	/*--------------------------------- Authentication ---------------------------------*/

	// async login(payload: { username: string, password: string }) {
	// 	const result = await this.auth.login(payload);
	// 	if (result._2FARequired) {
	// 		return result;
	// 	}
	// 	this.setAccessToken(result.accessToken);
	// 	return result;
	// }

	// async send2FACode(payload: { token: string, method: string }) {
	// 	return this.auth.send2FACode(payload);
	// }

	// async verify2FACode(payload: { token: string, code: string }) : Promise<{
	// 	user: any;
	// 	accessToken: any;
	// }> {
	// 	const result = await this.auth.verify2FACode(payload);
	// 	this.setAccessToken(result.accessToken);
	// 	return result;
	// }

	// async logout() {
	// 	console.log('APIClient::logout();');
	// 	await this.auth.logout();
	// 	this.setAccessToken('');
	// }

	// async refreshToken() {
	// 	const result = await this.auth.refreshToken();
	// 	this.setAccessToken(result.accessToken);
	// 	return result;
	// }

	// async register(payload: {
	// 	first_name: string,
	// 	last_name: string,
	// 	username: string,
	// 	email: string,
	// 	password: string
	// }) {
	// 	return this.auth.register(payload);
	// }

	/*---------------------------------- Session Management ----------------------------------*/
	async fetchActiveSessions() {
		return this.auth.fetchActiveSessions();
	}

	async revokeSession(session_id: string) {
		return this.auth.revokeSession(session_id);
	}

	async revokeAllOtherSessions() {
		return this.auth.revokeOtherSessions();
	}

	/*--------------------------------- Password Management ---------------------------------*/

	async changePassword(
		oldPassword: string,
		newPassword: string
	) {
		return this.auth.changePassword(oldPassword, newPassword);
	}

	async requestPasswordReset(email: string) {
		return this.auth.requestPasswordReset(email);
	}

	async verifyPasswordResetCode(token: string, code: string) {
		return this.auth.verifyPasswordResetCode(token, code);
	}

	async resetPassword(token: string, newPassword: string) {
		return this.auth.resetPassword(token, newPassword);
	}

	async resetPasswordResend(token: string) {
		return this.auth.resetPasswordResend(token);
	}

	// async resetPasswordResend(token: string) {
	// 	return this.auth.resetPasswordResend(token);
	// }

	async fetchPlayerStatus(user_id: number) : Promise<RemotePlayerStatus>{
		const res = await this.client.get(`/game/user/${user_id}/status`);
		return res.data;
	}

	async fetchGameRoomStatus(room_id: string) : Promise<GameRoomStatus> {
		const res = await this.client.get(`/game/room/${room_id}/status`);
		return res.data;
	}

	async createGameRoom(playersIds: number[], gameType: string, gameMode: string) {
		const res = await this.client.post(`/game/room/create`,
			{
				playersIds,
				gameType,
				gameMode
			},
		);
		return res.data;
	}

	connectWebSocket(path: string) {
		const origin = window.location.origin.replace('http', 'ws');

		const url = `${origin}/api-ws${path}`; // TODO Change to dynamic
		const ws = new WebSocket(`${url}${url.includes('?') ? '&' : '?'}accessToken=${this.accessToken}`);

		return (ws);
	}

	private classifyError(err: any) : APIError {
		if (!err.response) {
			return {
				code: 'NETWORK_ERR',
				message: 'Network Error - Try again later!'
			};
		}

		return {
			code: err.response.data.error.code || 'ERROR',
			message: err.response.data.error.message || 'Something Went Wrong! - Coming from ClassifyError',
			details: err
		};
	}
}
