import { timingSafeEqual } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

export const verifyMetricsToken = async (req: FastifyRequest, rep: FastifyReply) => {
	if (req.url === '/inter-metrics') {
		const auth = req.headers['authorization'];
		const expected =
			'Basic ' +
			Buffer.from(
				`${process.env.METRIC_USER}:${process.env.METRIC_PASSWORD}`,
			).toString('base64');
		if (!auth)
			return rep
				.status(401)
				.header('www-authenticate', 'Basic')
				.send('Unauthorized');

		const authBuffer = Buffer.from(auth);
		const expectedBuffer = Buffer.from(expected);

		if (
			authBuffer.length !== expectedBuffer.length ||
			!timingSafeEqual(authBuffer, expectedBuffer)
		) {
			return rep
				.status(401)
				.header('www-authenticate', 'Basic')
				.send('Unauthorized');
		}
	}
};
