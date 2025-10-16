import { AxiosInstance } from 'axios';

export type APIEnabledMethodsResponse = Array<'TOTP' | 'SMS' | 'EMAIL'>;
export type APITOTPSecrets = { secret_base32: string, secret_qrcode_url: string };
export type APITwoFASetupResponse = { token: string, secrets: APITOTPSecrets };

export class MfaService {
	constructor(private client: AxiosInstance) {}

	/*-------------------------------------- 2FA --------------------------------------*/

	async fetchEnabledMethods() : Promise<APIEnabledMethodsResponse> {
		const { data: res } = await this.client.get('/auth/2fa/enabled');
		return res.data;
	}

	async enableMethod(method: string) : Promise<undefined> {
		const { data: res } = await this.client.post(`/auth/2fa/enabled/${method}`);
		return res.data;
	}
	async disableMethod(method: string) : Promise<undefined> {
		const { data: res } = await this.client.delete(`/auth/2fa/enabled/${method}`);
		return res.data;
	}

	async setupTOTP() : Promise<APITwoFASetupResponse> {
		const { data: res } = await this.client.post(`/auth/2fa/setup-totp`);
		return res.data;
	}
	async verifyTOTP(token: string, code: string) : Promise<APITwoFASetupResponse> {
		const { data: res } = await this.client.post(`/auth/2fa/setup-totp/verify`, { token, code });
		return res.data;
	}
}
