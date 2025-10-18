import { AxiosInstance } from "axios";

export type APIVerifyContactResponse = { token: string };

export class VerifyService {
	constructor(private client: AxiosInstance) {}

	/*-------------------------------------- 2FA --------------------------------------*/

	async requestEmail(target: string) : Promise<APIVerifyContactResponse> {
		const { data: res } = await this.client.post(`/auth/verify-email`, { target });
		return res.data;
	}
	async verifyEmail(token: string, code: string) {
		const { data: res } = await this.client.post(`/auth/verify-email/verify`, { token, code });
		return res.data;
	}
	async resendEmail(token: string) {
		const { data: res } = await this.client.post(`/auth/verify-email/resend`, { token });
		return res.data;
	}

	async requestPhone(target: string) : Promise<APIVerifyContactResponse> {
		const { data: res } = await this.client.post(`/auth/verify-phone`, { target });
		return res.data;
	}
	async verifyPhone(token: string, code: string) {
		const { data: res } = await this.client.post(`/auth/verify-phone/verify`, { token, code });
		return res.data;
	}
	async resendPhone(token: string) {
		const { data: res } = await this.client.post(`/auth/verify-phone/resend`, { token });
		return res.data;
	}
}
