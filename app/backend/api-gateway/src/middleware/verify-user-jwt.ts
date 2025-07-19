import { FastifyReply, FastifyRequest } from 'fastify';

export const verifyUserJWT = async (req: FastifyRequest, rep: FastifyReply) => {
	// TODO: Redirect the JWT Verification to the Auth MS
	

	// TODO: Retrieve the username from the jwt token and assign it to this header
	// `x-user-username` is a custom header used to identify the user
	req.headers['x-user-username'] = 'iassil';
};
