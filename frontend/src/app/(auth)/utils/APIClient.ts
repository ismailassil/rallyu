/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';

interface IUserPerformance {
	level: number,
	xp: number,
	rank: number,
	win_rate: number,
	current_streak: string,
	longest_streak: number,
	games : {
		games: number,
		wins: number,
		losses: number,
		draws: number,
		ping_pong: {
			games: number,
			wins: number,
			losses: number,
			draws: number,
			win_rate: number
		},
		tic_tac_toe: {
			games: number,
			wins: number,
			losses: number,
			draws: number,
			win_rate: number
		}
	}
};

interface IGameHistory {
	game_id: number,
	game_type: string,
	player_home: {
		username: string,
		avatar: string,
		score: string
	},
	player_away: {
		username: string,
		avatar: string,
		score: string
	}
}

interface IUserInfo {
	first_name: string,
	last_name: string,
	email: string,
	username: string,
	bio: string,
	avatar_url: string,
	role: string
}

interface IUserProfile {
	profile: IUserInfo,
	performance: IUserPerformance,
	games_history: Array<IGameHistory>
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

	async getUserInfo(username: string) : Promise<IUserProfile> {
		const { data: res } = await this.client.get(`/users/${username}/profile`);
		return res.data;
	}

	async getUserPerformance(username: string) {
		const { data: res } = await this.client.get(`/users/${username}/performance`);
		return res.data;
	}

	async getUserGamesHistory(username: string) {
		const { data: res } = await this.client.get(`/users/${username}/games?page=1`); // TODO
		return res.data;
	}

	async getUserProfile(username: string) : Promise<IUserProfile> {
		const { data: res } = await this.client.get(`/users/${username}/profile`);
		return res.data;
	}

	async uploadUserAvatar() {

	}

	async updateAccountSettings() {
		
	}

	/*--------------------------------- Authentication ---------------------------------*/

	async login(payload: { username: string, password: string }) {
		console.log('APIClient::login();');
		const { data } = await this.client.post('/auth/login', payload);
		console.log('login: ', data);
		this.setAccessToken(data.data.accessToken);
		return data;
	}

	async logout() {
		console.log('APIClient::logout();');
		await this.client.post('/auth/logout');
		this.setAccessToken('');
	}

	async refreshToken() {
		console.log('APIClient::refreshToken();');
		const { data } = await this.client.get('/auth/refresh');
		console.log('refreshToken: ', data);
		this.setAccessToken(data.data.accessToken);
		return data;
	}
	
	async fetchCurrentUser() {
		console.log('APIClient::fetchCurrentUser();');
		console.log('accessToken: ', this.accessToken);
		const { data } = await this.client.get('/users/me');
		console.log('fetchCurrentUser: ', data);
		return data.data;
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

	private classifyError(err: any) {
		if (!err.response) {
			return { type: 'network', message: 'Something went wrong. Please try again.' };
		}
		// const status = err.response.status;
		// if (status === 401) {
		// 	return { type: 'auth', message: 'Session expired. Please log in again.', original: err };
		// }
		// if (status === 403) {
		// 	return { type: 'forbidden', message: 'You do not have permission for this action.' };
		// }
		// if (status === 422) {
		// 	return { type: 'validation', details: err.response.data?.errors };
		// }
		// if (status >= 500) {
		// 	return { type: 'server', message: 'Server error. Please try again later.' };
		// }
		// return { type: 'unknown', message: 'An unexpected error occurred.' };
		return { type: 'auth', message: err.response.data.error.message };
	}
}
