/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';

interface FetchMatchesOptions {
	page?: number;
	limit?: number;
	gameType?: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all';
	time?: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all';
}

export type APIError = {
	code: string;
	message: string;
	details?: any;
}

export class APIClient {
	private client: AxiosInstance;
	private accessToken: string = '';
	private isRefreshing: boolean = false;
	private failedQueue: any[] = [];

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			withCredentials: true,
		});

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
		console.log('Setting accessToken: ', token);
		this.accessToken = token;
	}

	get instance(): AxiosInstance {
		return this.client;
	}

	/*--------------------------------- Users Profiles ---------------------------------*/
	
	async fetchUser(username: string) {
		const { data: res } = await this.client.get(`/users/${username}`);
		// res.data.user = this.normalizeUser(res.data.user);
		return res.data;
	}

	async fetchUserMatchesPage(username: string, options: FetchMatchesOptions = {}) {
		const params = new URLSearchParams();

		if (options.page) params.append("page", options.page.toString());
		if (options.limit) params.append("limit", options.limit.toString());
		if (options.gameType) params.append("gameTypeFilter", options.gameType);
		if (options.time) params.append("timeFilter", options.time);
		const { data: res } = await this.client.get(`/users/${username}/matches?${params.toString()}`);
		return res.data;
	}

	async fetchUserAnalytics(username: string) {
		const { data: res } = await this.client.get(`/users/${username}/analytics`);
		return res.data;
	}
	async fetchUserAnalyticsByDay(username: string) {
		const { data: res } = await this.client.get(`/users/${username}/analytics-by-day`);
		return res.data;
	}
	async fetchLeaderboard() {
		const { data: res } = await this.client.get(`/users/leaderboard?page=1&limit=10`);
		return res.data;
	}

	async searchUsersByUsername(username: string) {
		const { data: res } = await this.client.get(`/users/search-by-username?username=${username}`);
		return res.data;
	}

	// async getUserAvatar(url: string) {
	// 	const { data } = await this.client.get(`/users${url}`, {
	// 		responseType: 'blob'
	// 	});
	// 	return data;
	// }
	
	async uploadUserAvatar(profilePicture: FormData) {
		const { data: res } = await this.client.post(`/users/TODO/avatar`, profilePicture, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
		return res.data;
	}
	
	async updateUser(username: string, payload: { first_name?: string, last_name?: string, username?: string, email?: string, bio?: string }) {
		const { data: res } = await this.client.put(`/users/${username}`, payload);
		return res.data;
	}

	// async checkUsernameAvailable(username: string) {
	// 	const { data: res } = await this.client.get(`/users/${username}/performance`);

	// }

	/*--------------------------------- Users Relations ---------------------------------*/

	async getAllFriends(){
		const { data: res } = await this.client.get(`/users/friends`);
		return res.data;
	}
	async getAllBlocked(){
		const { data: res } = await this.client.get(`/users/blocked`);
		return res.data;
	}
	async getAllIncomingFriendRequests(){
		const { data: res } = await this.client.get(`/users/friends/requests/incoming`);
		return res.data;
	}
	async getAllOutgoingFriendRequests(){
		const { data: res } = await this.client.get(`/users/friends/requests/outgoing`);
		return res.data;
	}

	async sendFriendRequest(user_id: number) {
		const { data: res } = await this.client.post(`/users/${user_id}/friends/requests`);
		return res.data;
	}

	async cancelFriendRequest(user_id: number) {
		const { data: res } = await this.client.delete(`/users/${user_id}/friends/requests`);
		return res.data;
	}

	async acceptFriendRequest(user_id: number) {
		const { data: res } = await this.client.put(`/users/${user_id}/friends/accept`);
		return res.data;
	}

	async rejectFriendRequest(user_id: number) {
		const { data: res } = await this.client.put(`/users/${user_id}/friends/reject`);
		return res.data;
	}

	async blockUser(user_id: number) {
		const { data: res } = await this.client.post(`/users/${user_id}/block`);
		return res.data;
	}

	async unblockUser(user_id: number) {
		const { data: res } = await this.client.delete(`/users/${user_id}/block`);
		return res.data;
	}

	async unfriend(user_id: number) {
		const { data: res } = await this.client.delete(`/users/${user_id}/friends`);
		return res.data;
	}

	/*-------------------------------------- 2FA --------------------------------------*/

	async mfaEnabledMethods() {
		const { data: res } = await this.client.get('/auth/2fa/enabled');
		return res.data;
	}
	
	async mfaDisableMethod(method: string) {
		const { data: res } = await this.client.delete(`/auth/2fa/enabled/${method}`);
		return res.data;
	}

	async mfaSetupInit(method: string) {
		const { data: res } = await this.client.post(`/auth/2fa/${method}/setup/init`);
		return res.data;
	}
	async mfaSetupVerify(method: string, code: string) {
		const { data: res } = await this.client.post(`/auth/2fa/${method}/setup/verify`, { code });
		return res.data;
	}
	
	// async mfaEmailSetupInit() {
	// 	const { data: res } = await this.client.post('/auth/mfa/email/setup/init');
	// 	return res.data;
	// }
	// async mfaEmailSetupVerify(code: string) {
	// 	const { data: res } = await this.client.post('/auth/mfa/email/setup/verify', { code });
	// 	return res.data;
	// }

	// async mfaPhoneSetupInit(phoneNumber: string) {
	// 	const { data: res } = await this.client.post('/auth/mfa/sms/setup/init', { phone: phoneNumber });
	// 	return res.data;
	// }
	// async mfaPhoneSetupVerify(code: string) {
	// 	const { data: res } = await this.client.post('/auth/mfa/sms/setup/verify', { code });
	// 	return res.data;
	// }

	/*--------------------------------- Authentication ---------------------------------*/

	async login(payload: { username: string, password: string }) {
		console.log('APIClient::login();');
		const { data: res } = await this.client.post('/auth/login', payload);
		console.log('login: ', res);

		if (res.data._2FARequired)
			return res.data;

		// if (res.data._2FARequired) {
		// 	return {
		// 		_2FARequired: true,
		// 		enabled2FAMethods: res.data.enabled2FAMethods,
		// 		loginChallengeId: res.data.loginChallengeID
		// 	};
		// }

		this.setAccessToken(res.data.accessToken);

		return { user: res.data.user, accessToken: res.data.accessToken };
	}


	async send2FACode(payload: { loginChallengeID: number, method: string }) {
		const { data: res } = await this.client.post('/auth/login/2fa/send', payload);
		return res.data;
	}

	async verify2FACode(payload: { loginChallengeID: number, method: string, code: string }) : Promise<{
		user: any;
		accessToken: any;
	}> {
		const { data: res } = await this.client.post('/auth/login/2fa/verify', payload);

		this.setAccessToken(res.data.accessToken);

		return { user: res.data.user, accessToken: res.data.accessToken };
	}

	async logout() {
		console.log('APIClient::logout();');
		await this.client.post('/auth/logout');
		this.setAccessToken('');
	}

	async refreshToken() {
		console.log('APIClient::refreshToken();');
		const { data: res } = await this.client.get('/auth/refresh');
		console.log('refreshToken: ', res);
		this.setAccessToken(res.data.accessToken);

		return { user: res.data.user, accessToken: res.data.accessToken };
	}
	
	async register(payload: { 
		first_name: string, 
		last_name: string, 
		username: string, 
		email: string, 
		password: string 
	}) {
		console.log('APIClient::register();');
		const { data } = await this.client.post('/auth/register', payload);
		console.log('register: ', data);
		return data;
	}

	async changePassword(payload: {
		old_password: string,
		new_password: string
	}) {
		const { data: res } = await this.client.post(`/auth/change-password`, payload);
		return res.data;
	}

	connectWebSocket(path: string) {
		const url = `ws://localhost:4025/api${path}`; // TODO Change to dynamic
		const ws = new WebSocket(`${url}${url.includes('?') ? '&' : '?'}accessToken=${this.accessToken}`);

		return (ws);
	}

	private classifyError(err: any) : APIError {
		try {
			if (!err.response) {
				return {
					code: 'NETWORK_ERR',
					message: 'Network Error - Try again later!'
				};
			}

			return {
				code: err.response.data.error.code || 'ERROR',
				message: err.response.data.error.message || 'Something Went Wrong! - Coming from ClassifyError'
			};
		} catch {
			return {
				code: 'ERROR',
				message: 'Something Went Wrong! - Coming from ClassifyError'
			};
		}
	}
}
