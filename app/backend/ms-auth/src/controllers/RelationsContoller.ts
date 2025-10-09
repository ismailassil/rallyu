import { FastifyReply, FastifyRequest } from "fastify";
import RelationsService from "../services/User/RelationsService";
import { IRelationsRequest } from "../types";
import { JSONCodec } from "nats";
import AuthResponseFactory from "./AuthResponseFactory";

class RelationsController {
	constructor(
		private relationsService: RelationsService
	) {}

	async fetchFriendsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allFriends = await this.relationsService.getFriends(user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, allFriends);

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async fetchBlockedHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allBlocked = await this.relationsService.getOutgoingBlocks(user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, allBlocked);

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async fetchIncomingFriendRequestsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allIncoming = await this.relationsService.getIncomingFriendRequests(user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, allIncoming);

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}
	async fetchOutgoingFriendRequestsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allOutgoing = await this.relationsService.getOutgoingFriendRequests(user_id!);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, allOutgoing);

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async sendFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.sendFriendRequest(user_id!, targetUserId);

			const subject = 'notification.dispatch';
			const jsonC = JSONCodec();
			const payload = jsonC.encode({
				senderId: user_id,
				receiverId: targetUserId,
				type: 'friend_request'
			});
			await request.server.js.publish(subject, payload);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async cancelFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.cancelFriendRequest(user_id!, targetUserId);

			// UPDATE THE NOTIFICATION
			const jsCodec = JSONCodec();
			const data = jsCodec.encode({
				senderId: targetUserId,
				receiverId: user_id,
				status: 'dismissed',
				type: 'friend_request',
				state: 'finished'
			});
			request.server.nc.publish("notification.update_status", data);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async acceptFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.acceptFriendRequest(targetUserId, user_id!);

			// UPDATE THE NOTIFICATION
			const jsCodec = JSONCodec();
			const data = jsCodec.encode({
				senderId: targetUserId,
				receiverId: user_id,
				status:'read',
				type:'friend_request',
				state: 'finished'
			});
			request.server.nc.publish("notification.update_status", data);
			
			// NOTIFY THE OTHER USER ABOUT IT
			const payload = jsCodec.encode({
				senderId: user_id,
				receiverId: targetUserId,
				type: 'status',
				message: "has accepted your invitation",
			});
			request.server.nc.publish("notification.dispatch", payload);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}
	
	async rejectFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;
			
			await this.relationsService.rejectFriendRequest(targetUserId, user_id!);
			
			// UPDATE THE NOTIFICATION
			const jsCodec = JSONCodec();
			const data = jsCodec.encode({
				senderId: targetUserId,
				receiverId: user_id,
				status:'read',
				type:'friend_request',
				state: 'finished'
			});
			request.server.nc.publish("notification.update_status", data);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async blockUserHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.blockUser(user_id!, targetUserId);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async unblockUserHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.unblockUser(user_id!, targetUserId);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}

	async unfriendHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.unfriend(user_id!, targetUserId);

			const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});

			return reply.status(status).send(body);
		} catch (err: any) {
			const { status, body } = AuthResponseFactory.getErrorResponse(err);

			return reply.code(status).send(body);
		}
	}
}

export default RelationsController;