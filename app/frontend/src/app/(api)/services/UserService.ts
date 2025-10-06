import { AxiosInstance } from 'axios';

interface FetchMatchesOptions {
	page?: number;
	limit?: number;
	gameType?: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all';
	time?: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all';
}

export class UserService {
	constructor(private client: AxiosInstance) {}

	/*--------------------------------- Users Profiles ---------------------------------*/
	
	async fetchUser(id: number) {
		const { data: res } = await this.client.get(`/users/${id}`);
		return res.data;
	}

	async fetchUserByUsername(username: string) {
		const { data: res } = await this.client.get(`/users/?username=${username}`);
		return res.data;
	}

	async fetchUserMatchesPage(id: number, options: FetchMatchesOptions = {}) {
		const params = new URLSearchParams();

		if (options.page) params.append("page", options.page.toString());
		if (options.limit) params.append("limit", options.limit.toString());
		if (options.gameType) params.append("gameTypeFilter", options.gameType);
		if (options.time) params.append("timeFilter", options.time);
		const { data: res } = await this.client.get(`/users/${id}/matches?${params.toString()}`);
		return res.data;
	}

	async fetchUserAnalytics(id: number) {
		const { data: res } = await this.client.get(`/users/${id}/analytics`);
		return res.data;
	}
	
	async fetchUserAnalyticsByDay(id: number) {
		const { data: res } = await this.client.get(`/users/${id}/analytics-by-day`);
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

	async getUserAvatarBlob(url: string) {
		const { data } = await this.client.get(`${url}`, {
			responseType: 'blob'
		});
		return data;
	}
	
	async updateUserAvatar(id: number, avatarFile: FormData) {
		const { data: res } = await this.client.post(`/users/${id}/avatar`, avatarFile, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
		return res.data;
	}
	
	async updateUser(id: number, payload: { first_name?: string, last_name?: string, username?: string, email?: string, bio?: string }) {
		const { data: res } = await this.client.put(`/users/${id}`, payload);
		return res.data;
	}

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
}