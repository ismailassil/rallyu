import { AxiosInstance } from 'axios';

export type APIEnabledMethodsResponse = Array<'TOTP' | 'SMS' | 'EMAIL'>;
export type APITOTPSecrets = { secret_base32: string, secret_qrcode_url: string };
export type APITwoFASetupResponse = { token: string, secrets: APITOTPSecrets | undefined };

export class MfaService {
	constructor(private client: AxiosInstance) {}

	/*-------------------------------------- 2FA --------------------------------------*/

	async mfaEnabledMethods() : Promise<APIEnabledMethodsResponse> {
		const { data: res } = await this.client.get('/auth/2fa/enabled');
		return res.data;
	}

	async mfaDisableMethod(method: string) : Promise<undefined> {
		const { data: res } = await this.client.delete(`/auth/2fa/enabled/${method}`);
		return res.data;
	}

	async mfaSetupInit(method: string) : Promise<APITwoFASetupResponse> {
		const { data: res } = await this.client.post(`/auth/2fa/setup?method=${method}`);
		return res.data;
	}

	async mfaSetupVerify(token: string, code: string) {
		const { data: res } = await this.client.post(`/auth/2fa/verify`, { token, code });
		return res.data;
	}
}
