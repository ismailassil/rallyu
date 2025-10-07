import { FastifyReply, FastifyRequest } from "fastify";
import RelationsService from "../services/User/RelationsService";
import { IRelationsRequest } from "../types";
import { JSONCodec } from "nats";

class RelationsController {
	constructor(
		private relationsService: RelationsService
	) {}

	async fetchFriendsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allFriends = await this.relationsService.getFriends(user_id!);

			reply.status(201).send({ success: true, data: allFriends });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async fetchBlockedHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allBlocked = await this.relationsService.getOutgoingBlocks(user_id!);

			reply.status(201).send({ success: true, data: allBlocked });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async fetchIncomingFriendRequestsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allIncoming = await this.relationsService.getIncomingFriendRequests(user_id!);

			reply.status(201).send({ success: true, data: allIncoming });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}
	async fetchOutgoingFriendRequestsHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const user_id = request.user?.sub;

			const allOutgoing = await this.relationsService.getOutgoingFriendRequests(user_id!);

			reply.status(201).send({ success: true, data: allOutgoing });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
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

			reply.status(201).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
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

			reply.status(204).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
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

			reply.status(200).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
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

			reply.status(204).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async blockUserHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.blockUser(user_id!, targetUserId);

			reply.status(200).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async unblockUserHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.unblockUser(user_id!, targetUserId);

			reply.status(200).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}

	async unfriendHandler(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { targetUserId } = request.params as { targetUserId: number };
			const user_id = request.user?.sub;

			await this.relationsService.unfriend(user_id!, targetUserId);

			reply.status(200).send({ success: true, data: {} });
		} catch (err: any) {
			console.error(err);
			const { statusCode, errorCode } = err;
			reply.status(statusCode).send({ success: false, error: errorCode });
		}
	}
}

export default RelationsController;