import { env } from './env';

export type OAuthConfig = {
	google: {
		client_id: string,
		client_secret: string,
		auth_uri: string,
		redirect_uri: string,
		exchange_uri: string
	},
	intra42: {
		client_id: string,
		client_secret: string,
		auth_uri: string,
		redirect_uri: string,
		exchange_uri: string,
		api_uri: string
	}
}

export const oauthConfig: OAuthConfig = {
	google: {
		client_id: env.GOOGLE_OAUTH_CLIENT_ID,
		client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
		auth_uri: env.GOOGLE_OAUTH_AUTH_URI,
		redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
		exchange_uri: env.GOOGLE_OAUTH_EXCHANGE_URI
	},
	intra42: {
		client_id: env.INTRA42_OAUTH_CLIENT_ID,
		client_secret: env.INTRA42_OAUTH_CLIENT_SECRET,
		auth_uri: env.INTRA42_OAUTH_AUTH_URI,
		redirect_uri: env.INTRA42_OAUTH_REDIRECT_URI,
		exchange_uri: env.INTRA42_OAUTH_EXCHANGE_URI,
		api_uri: env.INTRA42_API_URI,
	}
}
