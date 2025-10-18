import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ISessionFingerprint, UserPayload } from '../types';
import JWTUtils, { JWT_ACCESS_PAYLOAD } from '../utils/auth/Auth';
import { TokenRequiredError } from '../types/exceptions/auth.exceptions';
import { UAParser } from 'ua-parser-js';

function parseRequestFingerprint(userAgent: string, ip: string) : ISessionFingerprint {
	const parser = new UAParser(userAgent);

	const ua = parser.getResult();

	const device = parser.getDevice();
	const browser = parser.getBrowser();
	const os = parser.getOS();

	// let deviceName = [ ua.device.vendor || '', ua.device.model || '', ua.os.name || '', ua.os.version || ''].filter(Boolean).join(' ').trim();
	// let browserVersion = [ ua.browser.name || '', ua.browser.major || '' ].filter(Boolean).join(' ').trim();

	// if (!deviceName)
	// 	deviceName = 'Unknown Device';
	// if (!browserVersion)
	// 	browserVersion = 'Unknown Browser';

	const fingerprint: ISessionFingerprint = {
		device: device.type?.toString() || 'Desktop',
		browser: `${browser.name?.toString() || 'Unknown Browser'} on ${os.name?.toString() || 'Unknown OS'}`,
		ip_address: ip
	}

	return fingerprint;
}

async function Authenticate(request: FastifyRequest, reply: FastifyReply) : Promise<void> {
	const _JWTUtils: JWTUtils = new JWTUtils();

	console.log(`Authenticating User...`);
	try {
		request.fingerprint = parseRequestFingerprint(request.headers['user-agent'] || '', request.ip);

		console.log('Request Fingerprint: ', request.fingerprint);

		const authHeader = request.headers.authorization;

		if (!authHeader)
			throw new TokenRequiredError();
		// return reply.code(401).send({ success: false, error: 'Access token required!' });

		const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
		console.log('accessToken: ', accessToken);

		const decodedJWTAccessPayload: JWT_ACCESS_PAYLOAD = await _JWTUtils.verifyAccessToken(accessToken);
		// const decodedUserPayload = jwt.verify(accessToken, 'jwt-secret') as UserPayload;

		request.user = decodedJWTAccessPayload;
		console.log(`Authenticated Successfully: `);
		console.log(decodedJWTAccessPayload);
	} catch (err: any) {
		console.log(`Unauthorized...`);
		return reply.code(401).send({ success: false, error: err.message });
	}
}

export default Authenticate;
