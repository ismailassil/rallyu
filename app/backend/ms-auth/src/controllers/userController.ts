import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../services/userService";
import UserRepository from "../repositories/userRepository";
import { IProfileRequest } from "../types";
import { AuthError, UserNotFoundError } from "../types/auth.types";
import AuthResponseFactory from "./authResponseFactory";

class UserController {
	constructor(
		private userService: UserService
	) {}

	async usernameAvailable(request: FastifyRequest, reply: FastifyReply) {
		try {
			// TODO: ADD SCHEMA
			const { username } = request.query as { username: string };

			const isTaken = await this.userService.isUsernameTaken(username);

			reply.status(isTaken ? 404 : 200).send({ success: true, available: !isTaken });

		} catch (err: any) {
			reply.status(500).send({ success: false, data: {} })
		}
	}

	async emailAvailable(request: FastifyRequest, reply: FastifyReply) {
		try {
			// TODO: ADD SCHEMA
			const { email } = request.query as { email: string };

			const isTaken = await this.userService.isEmailTaken(email);

			reply.status(isTaken ? 404 : 200).send({ success: true, available: !isTaken });

		} catch (err: any) {
			reply.status(500).send({ success: false, data: {} })
		}
	}

	async searchUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			// TODO: ADD SCHEMA
			const user_id = request.user?.sub;
			const { username } = request.query as { username: string };

			const matchingUsers = await this.userService.searchUsersByUsername(user_id!, username);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, matchingUsers);

			reply.status(status).send(body);

		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	// GET FULL USER PROFILE (USER INFO + STATS SUMMARY + RECENT MATCHES + RELATIONSHIP)
	// async fetchMe(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const user_id = request.user?.sub;

	// 		const userProfile = await this.userService.fetchMe(user_id!);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, userProfile);

	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }

	// GET BASIC USER PROFILE (USER INFO)
	async fetchUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { username } = request.params as IProfileRequest;

			const user = await this.userService.getUser(user_id!, username);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, user);

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async fetchUserStats(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { username } = request.params as IProfileRequest;

			const userStats = await this.userService.getUserStats(user_id!, username);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, userStats);

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async fetchUserMatches(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const { page } = request.query as { page: number };
			const { username } = request.params as IProfileRequest;

			const userStats = await this.userService.getUserMatches(user_id!, username, page);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, userStats);

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async updateUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const updates = request.body;

			/*
				updates can only contain: first_name, last_name, username, email, bio
			*/

			console.log('REQUEST BODY: ', request.body);

			const newUser = await this.userService.updateUser(user_id!, updates);

			reply.status(200).send({ success: true, data: newUser });
		} catch (err: any) {
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	// DELETE USER
	async deleteUser(request: FastifyRequest, reply: FastifyReply) {

	}

	async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;
			const fileData = await request.file();

			if (!fileData)
				reply.status(400);

			const avatarUrl = await this.userService.updateAvatar(user_id!, fileData!);

			reply.status(201).send({ success: true, data: avatarUrl });
		} catch (err: any) {
			console.log(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode || 400).send({ success: false, error: errorCode });
		}
	}


	// GET FULL USER PROFILE (USER INFO + STATS SUMMARY + RECENT MATCHES + RELATIONSHIP)
	// async fetchFullUserProfile(request: FastifyRequest, reply: FastifyReply) {
	// 	try {
	// 		const user_id = request.user?.sub;
	// 		const { username } = request.params as IProfileRequest;

	// 		const userFullInfo = await this.userService.getUserFullInfo(user_id!, username);

	// 		const { status, body } = AuthResponseFactory.getSuccessResponse(200, userFullInfo);

	// 		reply.code(status).send(body);
	// 	} catch (err: any) {
	// 		const { status, body } = AuthResponseFactory.getErrorResponse(err);

	// 		reply.code(status).send(body);
	// 	}
	// }
}

export default UserController;