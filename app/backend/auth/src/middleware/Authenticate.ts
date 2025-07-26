import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import JWTUtils, { JWT_ACCESS_PAYLOAD } from '../utils/auth/Auth';
import { TokenRequiredError } from '../types/auth.types';

async function Authenticate(request: FastifyRequest, reply: FastifyReply) : Promise<void> {
	const _JWTUtils: JWTUtils = new JWTUtils();

	console.log(`Authenticating User...`);
	try {
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