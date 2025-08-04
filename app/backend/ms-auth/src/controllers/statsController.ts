import { FastifyRequest, FastifyReply } from "fastify";
import { IMatchesRequest, IStatsRequest } from "../types";
import StatsService from "../services/statsService";

class StatsController {
	private statsService: StatsService;

	constructor() {
		this.statsService = new StatsService();
	}

	// async UserStats(request)

	// async MyStats(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		// const { user_id: target_id } = request.params as IStatsRequest;
	// 		const user_id = request.user?.sub;

	// 		// const stats = await this.statsService.getUserStats(user_id!);
	// 		// console.log('myStats: ', stats);

	// 		// reply.status(201).send({ success: true, data: stats });
	// 	} catch (err: any) {
	// 		console.error(err);
	// 		const { statusCode, errorCode } = err;
	// 		reply.status(statusCode).send({ success: false, error: errorCode });
	// 	}
	// }


	// /*
	// 	- USER INFO
	// 	- USER PERFORMANCE
	// 	- USER MATCHES (LAST 10)
	// */
	// async UserProfile(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const { username } = request.params as IStatsRequest;
	// 		// const user_id = request.user?.sub;

	// 		const stats = await this.statsService.getUserProfile(username);

	// 		reply.status(201).send({ success: true, data: stats });
	// 	} catch (err: any) {
	// 		console.error(err);
	// 		const { statusCode, errorCode } = err;
	// 		reply.status(statusCode).send({ success: false, error: errorCode });
	// 	}
	// }

	// async UserProfile_(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const { username } = request.params as IStatsRequest;
	// 		// const user_id = request.user?.sub;

	// 		const stats = await this.statsService.getUserProfile(username);

	// 		reply.status(201).send({ success: true, data: stats });
	// 	} catch (err: any) {
	// 		console.error(err);
	// 		const { statusCode, errorCode } = err;
	// 		reply.status(statusCode).send({ success: false, error: errorCode });
	// 	}
	// }

	// async UserStats(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const { username } = request.params as IStatsRequest;
	// 		// const user_id = request.user?.sub;

	// 		const stats = await this.statsService.getUserPerformance(username);

	// 		reply.status(201).send({ success: true, data: stats });
	// 	} catch (err: any) {
	// 		console.error(err);
	// 		const { statusCode, errorCode } = err;
	// 		reply.status(statusCode).send({ success: false, error: errorCode });
	// 	}
	// }

	// async UserMatches(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const { username } = request.params as IMatchesRequest;
	// 		const { page } = request.query as { page: string };
	// 		// const user_id = request.user?.sub;

	// 		const matchesPage = await this.statsService.getUserMatches(username!, parseInt(page)!);

	// 		reply.status(201).send({ success: true, data: matchesPage });
	// 	} catch (err: any) {
	// 		console.error(err);
	// 		const { statusCode, errorCode } = err;
	// 		reply.status(statusCode).send({ success: false, error: errorCode });
	// 	}
	// }
}

export default StatsController;