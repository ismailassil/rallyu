/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import { UserService } from './services/UserService';
import { AuthService } from './services/AuthService';
import { MfaService } from './services/MfaService';

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
	
	// Service instances
	public user: UserService;
	public auth: AuthService;
	public mfa: MfaService;

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			withCredentials: true,
		});

		// Initialize services
		this.user = new UserService(this.client);
		this.auth = new AuthService(this.client);
		this.mfa = new MfaService(this.client);

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

	async searchUsersByUsername(username: string) {
		return this.user.searchUsersByUsername(username);
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
		return this.user.getAllFriends();
	}
	
	async getAllBlocked() {
		return this.user.getAllBlocked();
	}
	
	async getAllIncomingFriendRequests() {
		return this.user.getAllIncomingFriendRequests();
	}
	
	async getAllOutgoingFriendRequests() {
		return this.user.getAllOutgoingFriendRequests();
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
		return this.user.blockUser(user_id);
	}

	async unblockUser(user_id: number) {
		return this.user.unblockUser(user_id);
	}

	async unfriend(user_id: number) {
		return this.user.unfriend(user_id);
	}

	/*-------------------------------------- 2FA --------------------------------------*/

	async mfaEnabledMethods() {
		return this.mfa.mfaEnabledMethods();
	}
	
	async mfaDisableMethod(method: string) {
		return this.mfa.mfaDisableMethod(method);
	}

	async mfaSetupInit(method: string) {
		return this.mfa.mfaSetupInit(method);
	}
	
	async mfaSetupVerify(method: string, code: string) {
		return this.mfa.mfaSetupVerify(method, code);
	}

	/*--------------------------------- Authentication ---------------------------------*/

	async isUsernameAvailable(username: string) {
		return this.auth.isUsernameAvailable(username);
	}

	async isEmailAvailable(email: string) {
		return this.auth.isEmailAvailable(email);
	}

	async login(payload: { username: string, password: string }) {
		const result = await this.auth.login(payload);
		if (result._2FARequired) {
			return result;
		}
		this.setAccessToken(result.accessToken);
		return result;
	}

	async send2FACode(payload: { token: string, method: string }) {
		return this.auth.send2FACode(payload);
	}

	async verify2FACode(payload: { token: string, code: string }) : Promise<{
		user: any;
		accessToken: any;
	}> {
		const result = await this.auth.verify2FACode(payload);
		this.setAccessToken(result.accessToken);
		return result;
	}

	async logout() {
		console.log('APIClient::logout();');
		await this.auth.logout();
		this.setAccessToken('');
	}

	async refreshToken() {
		const result = await this.auth.refreshToken();
		this.setAccessToken(result.accessToken);
		return result;
	}
	
	async register(payload: { 
		first_name: string, 
		last_name: string, 
		username: string, 
		email: string, 
		password: string 
	}) {
		return this.auth.register(payload);
	}

	/*---------------------------------- Session Management ----------------------------------*/
	async fetchActiveSessions() {
		return this.auth.fetchActiveSessions();
	}

	async revokeSession(session_id: string) {
		return this.auth.revokeSession(session_id);
	}

	async revokeAllOtherSessions() {
		return this.auth.revokeAllOtherSessions();
	}

	/*--------------------------------- Password Management ---------------------------------*/

	async changePassword(payload: {
		oldPassword: string,
		newPassword: string
	}) {
		return this.auth.changePassword(payload);
	}

	async requestPasswordReset(email: string) {
		return this.auth.requestPasswordReset(email);
	}

	async verifyPasswordResetCode(payload: { email: string, code: string }) {
		return this.auth.verifyPasswordResetCode(payload);
	}

	async resetPassword(payload: { email: string, code: string, newPassword: string }) {
		return this.auth.resetPassword(payload);
	}

	async fetchPlayerStatus(user_id: number) {
		const res = await this.client.get(`/game/user/${user_id}`);
		return res.data;
	}

	connectWebSocket(path: string) {
		const url = `${window.location.origin}/api${path}`; // TODO Change to dynamic
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
