import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../services/userService";
import UserRepository from "../repositories/userRepository";
import { IProfileRequest } from "../types";
import { AuthError, UserNotFoundError } from "../types/auth.types";
import AuthResponseFactory from "./authResponseFactory";

class UserController {
	private userService: UserService;
	private userRepository: UserRepository;

	constructor() {
		this.userService = new UserService();
		this.userRepository = new UserRepository();
	}

	async UsernameEmailAvailable(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { username, email } = request.query as { username?: string, email?: string };

			if (!username && !email) {
				reply.status(400).send({ success: false, data: {} });
				return ;
			}

			let isTaken;

			if (username && !email)
				isTaken = await this.userRepository.findByUsername(username);
			else if (email && !username)
				isTaken = await this.userRepository.findByEmail(email);
			// else
			// 	isTaken = await this.userRepository.exists(username!, email!);

			reply.status(isTaken ? 404 : 200).send({ success: true, available: !isTaken });

		} catch (err: any) {
			reply.status(500).send({ success: false, data: {} })
		}
	}

	async fetchMe(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const userProfile = await this.userService.fetchMe(user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, userProfile);

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async getUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { username } = request.params as IProfileRequest;
			const user_id = request.user?.sub;

			const userProfile = await this.userService.getUser(user_id!, username);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, userProfile);

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async getUserStats(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const userStats = await this.userService.getUserStats(user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, userStats);

			reply.code(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			reply.code(status).send(body);
		}
	}

	async getUserMatches(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { page } = request.query as { page: number };
			const user_id = request.user?.sub;

			const userStats = await this.userService.getUserMatches(user_id!, page);

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

			// if (!['image/jpeg', 'image/png'].includes(fileData!.mimetype))
			// 	reply.status(404);
			// should check for max file size

			const avatarUrl = await this.userService.updateAvatar(user_id!, fileData!);

			reply.status(201).send({ success: true, data: avatarUrl });
		} catch (err: any) {
			console.log(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode || 400).send({ success: false, error: errorCode });
		}
	}
}

export default UserController;