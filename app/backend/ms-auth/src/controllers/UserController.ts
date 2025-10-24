import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../services/User/UserService";
import { IProfileRequest } from "../types";
import AuthResponseFactory from "./AuthResponseFactory";

class UserController {
	constructor(
		private userService: UserService
	) {}

	async usernameAvailableHandler(request: FastifyRequest, reply: FastifyReply) {
		const { username } = request.query as { username: string };

		const isTaken = await this.userService.isUsernameTaken(username);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, !isTaken);
		return reply.code(status).send(body);
	}

	async emailAvailableHandler(request: FastifyRequest, reply: FastifyReply) {
		const { email } = request.query as { email: string };

		const isTaken = await this.userService.isEmailTaken(email.trim().toLowerCase());

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, !isTaken);
		return reply.code(status).send(body);
	}

	async lookupUsersHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { query } = request.query as { query: string };

		const matchingUsers = await this.userService.searchUsersByQuery(user_id!, query);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, matchingUsers);
		return reply.code(status).send(body);
	}

	async fetchUserHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { id } = request.params as { id: number };

		const user = await this.userService.getUserProfile(user_id!, id, undefined);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, user);
		return reply.code(status).send(body);
	}

	async fetchUserByUsernameQueryHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { username } = request.query as { username: string };

		const user = await this.userService.getUserProfile(user_id!, undefined, username);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, user);
		return reply.code(status).send(body);
	}

	async fetchUserAnalyticsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { id } = request.params as { id: number };

		const userAnalytics = await this.userService.getUserAnalytics(user_id!, id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, userAnalytics);
		return reply.code(status).send(body);
	}
	async fetchUserAnalyticsByDayHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const { id } = request.params as { id: number };

		const userAnalyticsByDay = await this.userService.getUserAnalyticsByDay(user_id!, id);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, userAnalyticsByDay);
		return reply.code(status).send(body);
	}

	async fetchUserMatchesHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const { page, limit, gameTypeFilter, timeFilter } = request.query as Record<string, any>;

		// PAGINATION FILTER
		const paginationFilterValidated = (page && limit) ? { page: Number(page), limit: Number(limit) } : undefined;

		// TIME FILTER
		const validGameTypes = ['PONG', 'XO', 'all'];
		const gameFilterValidated = validGameTypes.includes(gameTypeFilter) ? gameTypeFilter : undefined;

		// GAMETYPE FILTER
		const validTimeFilters = ['0d','1d','7d','30d','90d','1y','all'];
		const timeFilterValidated = validTimeFilters.includes(timeFilter) ? timeFilter : undefined;

		console.log('REQUEST QUERY: ', request.query);
		const { id } = request.params as { id: number };

		const userMatches = await this.userService.getUserMatches(user_id!, id, timeFilterValidated, gameFilterValidated, paginationFilterValidated);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, userMatches);
		return reply.code(status).send(body);
	}

	async fetchRankLeaderboardHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const { page, limit } = request.query as Record<string, any>;

		// PAGINATION FILTER
		const paginationFilterValidated = (page && limit) ? { page: Number(page), limit: Number(limit) } : undefined;

		const { id } = request.params as { id: number };

		const userMatches = await this.userService.getRankLeaderboard(paginationFilterValidated);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, userMatches);
		return reply.code(status).send(body);
	}

	async updateUserHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const updates = request.body;

		/*
			updates can only contain: first_name, last_name, username, email, bio
		*/

		console.log('REQUEST BODY: ', request.body);

		const newUser = await this.userService.updateUser(user_id!, updates);

		return reply.code(200).send({ success: true, data: newUser });
	}

	// DELETE USER
	async deleteUserHandler(request: FastifyRequest, reply: FastifyReply) {

	}

	async uploadAvatarHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;
		const fileData = await request.file();

		if (!fileData)
			return reply.code(400);

		const avatarUrl = await this.userService.updateAvatar(user_id!, fileData!);

		return reply.code(201).send({ success: true, data: avatarUrl });
	}
}

export default UserController;
