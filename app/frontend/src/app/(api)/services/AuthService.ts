/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

export type APIResetPasswordResponse = { token: string };

export class AuthService {
	constructor(
		private client: AxiosInstance,
		private setAccessToken: (token: string) => void
	) {}

	/*--------------------------------- Authentication ---------------------------------*/

	async isUsernameAvailable(username: string) {
		const { data: res } = await this.client.get(`/users/username-available?username=${username}`);
		return res.data;
	}

	async isEmailAvailable(email: string) {
		const { data: res } = await this.client.get(`/users/email-available?email=${email}`);
		return res.data;
	}

	async login(payload: { username: string, password: string }) {
		const { data: res } = await this.client.post('/auth/login', payload);

		if (res.data._2FARequired)
			return res.data;

		this.setAccessToken(res.data.accessToken);

		return { user: res.data.user, accessToken: res.data.accessToken };
	}

	async loginUsing2FA(token: string, code: string) {
		const { data: res } = await this.client.post('/auth/login/2fa/verify', { token, code });

		this.setAccessToken(res.data.accessToken);

		return { user: res.data.user, accessToken: res.data.accessToken };
	}

	async select2FAMethod(token: string, method: string) {
		const { data: res } = await this.client.post('/auth/login/2fa/select', { token, method });
		return res.data;
	}

	async verify2FACode(token: string, code: string) : Promise<{
		user: any;
		accessToken: any;
	}> {
		const { data: res } = await this.client.post('/auth/login/2fa/verify', { token, code });

		return { user: res.data.user, accessToken: res.data.accessToken };
	}

	async resend2FACode(token: string) {
		const { data: res } = await this.client.post('/auth/login/2fa/resend', { token });
		return res.data;
	}

	async logout() {
		console.log('APIClient::logout();');
		await this.client.post('/auth/logout');
	}

	async refreshToken() {
		console.log('APIClient::refreshToken();');
		const { data: res } = await this.client.get('/auth/refresh');
		console.log('refreshToken: ', res);

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

	/*---------------------------------- Session Management ----------------------------------*/
	async fetchActiveSessions() {
		const { data: res } = await this.client.get('/auth/sessions');
		return res.data;
	}

	async revokeSession(session_id: string) {
		const { data: res } = await this.client.delete(`/auth/sessions/${session_id}`);
		return res.data;
	}

	async revokeAllOtherSessions() {
		const { data: res } = await this.client.delete('/auth/sessions');
		return res.data;
	}

	/*--------------------------------- Password Management ---------------------------------*/

	async changePassword(payload: {
		oldPassword: string,
		newPassword: string
	}) {
		const { data: res } = await this.client.post(`/auth/change-password`, payload);
		return res.data;
	}

	async requestPasswordReset(email: string) : Promise<APIResetPasswordResponse> {
		const { data: res } = await this.client.post(`/auth/reset-password`, { email });
		return res.data;
	}

	async verifyPasswordResetCode(token: string, code: string) {
		const { data: res } = await this.client.post(`/auth/reset-password/verify`, { token, code });
		return res.data;
	}

	async resetPassword(token: string, newPassword: string) {
		const { data: res } = await this.client.post(`/auth/reset-password/update`, { token, newPassword });
		return res.data;
	}

	async resetPasswordResend(token: string) {
		const { data: res } = await this.client.post(`/auth/reset-password/resend`, { token });
		return res.data;
	}

	/*--------------------------------- Verification ---------------------------------*/

	async requestVerifyEmail(newEmail?: string) {
		const { data: res } = await this.client.post(`/auth/verify-email`, { target: newEmail });
		return res.data;
	}

	async verifyEmail(token: string, code: string) {
		const { data: res } = await this.client.post(`/auth/verify-email/verify`, { token, code });
		return res.data;
	}

	async requestVerifyPhone(newPhone?: string) {
		const { data: res } = await this.client.post(`/auth/verify-phone`, { target: newPhone });
		return res.data;
	}

	async verifyPhone(token: string, code: string) {
		const { data: res } = await this.client.post(`/auth/verify-phone/verify`, { token, code });
		return res.data;
	}

}
