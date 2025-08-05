import { FastifyReply, FastifyRequest } from "fastify";
import RelationsService from "../services/relationsService";
import { IRelationsRequest } from "../types";
import fastify from '../server';
import { JSONCodec } from "nats";

class RelationsController {
	private relationsService: RelationsService;

	constructor() {
		this.relationsService = new RelationsService();
	}

	async getAllFriends(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allFriends = await this.relationsService.getAllFriends(user_id!);

			reply.status(201).send({ success: true, data: allFriends });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async sendFriendRequest(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			const newRelation = await this.relationsService.sendFriendRequest(user_id!, parseInt(target_id));

			const subject = 'notification.dispatch';
			const jsonC = JSONCodec();
			const payload = jsonC.encode({
				senderId: user_id,
				receiverId: target_id,
				type: 'friend_request'
			});
			await request.server.js.publish(subject, payload);

			// console.log(request.server);
			// console.log('jetStream: ', request.server.js);

			reply.status(201).send({ success: true, data: newRelation });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async cancelFriendRequest(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			await this.relationsService.cancelFriendRequest(user_id!, parseInt(target_id));

			reply.status(204).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async acceptFriendRequest(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			const newRelation = await this.relationsService.acceptFriendRequest(parseInt(target_id), user_id!);

			reply.status(200).send({ success: true, data: newRelation });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async rejectFriendRequest(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			// await this.relationsService.rejectFriendRequest(user_id!, parseInt(target_id));
			await this.relationsService.rejectFriendRequest(parseInt(target_id), user_id!);

			reply.status(204).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async blockUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			const newRelation = await this.relationsService.blockUser(user_id!, parseInt(target_id));

			reply.status(200).send({ success: true, data: newRelation });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async unblockUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			await this.relationsService.unblockUser(user_id!, parseInt(target_id));

			reply.status(200).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async unfriend(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { user_id: target_id } = request.params as IRelationsRequest;
			const user_id = request.user?.sub;

			await this.relationsService.unfriend(user_id!, parseInt(target_id));

			reply.status(200).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}
}

export default RelationsController;