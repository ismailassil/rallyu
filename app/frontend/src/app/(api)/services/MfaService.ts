import { AxiosInstance } from 'axios';

export class MfaService {
	constructor(private client: AxiosInstance) {}

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
}