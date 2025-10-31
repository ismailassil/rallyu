import { FastifyReply, FastifyRequest } from "fastify";
import RelationsService from "../services/User/RelationsService";
import { JSONCodec } from "nats";
import AuthResponseFactory from "./AuthResponseFactory";

enum RELATION_EVENT_TYPE {
	SEND_FRIEND_REQ = 'SEND_FRIEND_REQ',
	CANCEL_FRIEND_REQ = 'CANCEL_FRIEND_REQ',
	ACCEPT_FRIEND_REQ = 'ACCEPT_FRIEND_REQ',
	REJECT_FRIEND_REQ = 'REJECT_FRIEND_REQ',
	BLOCK_REQ = 'BLOCK_REQ',
	UNBLOCK_REQ = 'UNBLOCK_REQ',
	UNFRIEND_REQ = 'UNFRIEND_REQ'
}

class RelationsController {
	constructor(
		private relationsService: RelationsService,
		private nats: any,
		private js: any
	) {}

	async fetchFriendsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const allFriends = await this.relationsService.getFriends(user_id!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, allFriends);
		return reply.code(status).send(body);
	}

	async fetchBlockedHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const allBlocked = await this.relationsService.getOutgoingBlocks(user_id!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, allBlocked);
		return reply.code(status).send(body);
	}

	async fetchIncomingFriendRequestsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const allIncoming = await this.relationsService.getIncomingFriendRequests(user_id!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, allIncoming);
		return reply.code(status).send(body);
	}
	async fetchOutgoingFriendRequestsHandler(request: FastifyRequest, reply: FastifyReply) {
		const user_id = request.user?.sub;

		const allOutgoing = await this.relationsService.getOutgoingFriendRequests(user_id!);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, allOutgoing);
		return reply.code(status).send(body);
	}

	async sendFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		const result = await this.relationsService.sendFriendRequest(user_id!, targetUserId);
		if (result === 'CREATED') {
			await this.publishNotification(RELATION_EVENT_TYPE.SEND_FRIEND_REQ, user_id!, targetUserId);
			await this.publishRelationUpdate(RELATION_EVENT_TYPE.SEND_FRIEND_REQ, user_id!, targetUserId);
		}

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { message: result });
		return reply.code(status).send(body);
	}

	async cancelFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		await this.relationsService.cancelFriendRequest(user_id!, targetUserId);
		await this.publishNotification(RELATION_EVENT_TYPE.CANCEL_FRIEND_REQ, user_id!, targetUserId);
		await this.publishRelationUpdate(RELATION_EVENT_TYPE.CANCEL_FRIEND_REQ, user_id!, targetUserId);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async acceptFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		await this.relationsService.acceptFriendRequest(targetUserId, user_id!);
		await this.publishNotification(RELATION_EVENT_TYPE.ACCEPT_FRIEND_REQ, user_id!, targetUserId);
		await this.publishRelationUpdate(RELATION_EVENT_TYPE.ACCEPT_FRIEND_REQ, user_id!, targetUserId);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async rejectFriendRequestHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		await this.relationsService.rejectFriendRequest(targetUserId, user_id!);
		await this.publishNotification(RELATION_EVENT_TYPE.REJECT_FRIEND_REQ, user_id!, targetUserId);
		await this.publishRelationUpdate(RELATION_EVENT_TYPE.REJECT_FRIEND_REQ, user_id!, targetUserId);

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, {});
		return reply.code(status).send(body);
	}

	async blockUserHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		const result = await this.relationsService.blockUser(user_id!, targetUserId);
		if (result === 'CREATED') {
			await this.publishNotification(RELATION_EVENT_TYPE.BLOCK_REQ, user_id!, targetUserId);
			await this.publishRelationUpdate(RELATION_EVENT_TYPE.BLOCK_REQ, user_id!, targetUserId);
		}

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { message: result });
		return reply.code(status).send(body);
	}

	async unblockUserHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		const result = await this.relationsService.unblockUser(user_id!, targetUserId);
		if (result === 'DELETED') {
			await this.publishNotification(RELATION_EVENT_TYPE.UNBLOCK_REQ, user_id!, targetUserId);
			await this.publishRelationUpdate(RELATION_EVENT_TYPE.UNBLOCK_REQ, user_id!, targetUserId);
		}

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { message: result });

		return reply.code(status).send(body);
	}

	async unfriendHandler(request: FastifyRequest, reply: FastifyReply) {
		const { targetUserId } = request.params as { targetUserId: number };
		const user_id = request.user?.sub;

		const result = await this.relationsService.unfriend(user_id!, targetUserId);
		if (result === 'DELETED') {
			await this.publishNotification(RELATION_EVENT_TYPE.UNFRIEND_REQ, user_id!, targetUserId);
			await this.publishRelationUpdate(RELATION_EVENT_TYPE.UNFRIEND_REQ, user_id!, targetUserId);
		}

		const { status, body } = AuthResponseFactory.getSuccessResponse(200, { message: result });

		return reply.code(status).send(body);
	}

	private publishRelationUpdate(relationEvent: RELATION_EVENT_TYPE, userId: number, targetId: number) {
		if (!this.nats || !this.js)
			return ;

		const SUBJECT = 'gateway.user.relation';
		const _JSONCodec = JSONCodec();

		const baseData = { requesterId: Number(userId), receiverId: Number(targetId) };
		const publishFn = (recipientUserIds: number[], status: string) => {
			this.nats.publish(SUBJECT, _JSONCodec.encode({
				eventType: 'RELATION_UPDATE',
				recipientUserIds,
				data: { ...baseData, status },
			}));
		}

		switch (relationEvent) {
			case RELATION_EVENT_TYPE.SEND_FRIEND_REQ:
				publishFn([userId], 'OUTGOING');
				publishFn([targetId], 'INCOMING');
				break;

			case RELATION_EVENT_TYPE.ACCEPT_FRIEND_REQ:
				publishFn([userId, targetId], 'FRIENDS');
				break;

			case RELATION_EVENT_TYPE.BLOCK_REQ:
				publishFn([userId, targetId], 'BLOCKED');
				break;

			case RELATION_EVENT_TYPE.CANCEL_FRIEND_REQ:
			case RELATION_EVENT_TYPE.REJECT_FRIEND_REQ:
			case RELATION_EVENT_TYPE.UNBLOCK_REQ:
			case RELATION_EVENT_TYPE.UNFRIEND_REQ:
				publishFn([userId, targetId], 'NONE');
				break;
		}
	}

	private async publishNotification(relationEvent: RELATION_EVENT_TYPE, userId: number, targetId: number) {
		if (!this.nats || !this.js)
			return ;

		const _JSONCodec = JSONCodec();

		const actionsMap = {
			[RELATION_EVENT_TYPE.SEND_FRIEND_REQ]: {
				subject: 'notification.dispatch',
				payload: _JSONCodec.encode({ senderId: userId, receiverId: targetId, type: 'friend_request' }),
				useJS: true,
			},
			[RELATION_EVENT_TYPE.CANCEL_FRIEND_REQ]: {
				subject: 'notification.gateway',
				payload: _JSONCodec.encode({ load: { eventType: 'SERVICE_EVENT', data: { senderId: userId, receiverId: targetId, load: { type: 'friend_request', status: 'cancel' }, }, }, }),
				useJS: false,
			},
			[RELATION_EVENT_TYPE.ACCEPT_FRIEND_REQ]: {
				subject: 'notification.gateway',
				payload: _JSONCodec.encode({ load: { eventType: 'SERVICE_EVENT', data: { senderId: targetId, receiverId: userId, load: { type: 'friend_request', status: 'accept' }, }, }, }),
				useJS: false,
			},
			[RELATION_EVENT_TYPE.REJECT_FRIEND_REQ]: {
				subject: 'notification.gateway',
				payload: _JSONCodec.encode({ load: { eventType: 'SERVICE_EVENT', data: { senderId: targetId, receiverId: userId, load: { type: 'friend_request', status: 'reject' }, }, }, }),
				useJS: false,
			},
			[RELATION_EVENT_TYPE.BLOCK_REQ]: undefined,
			[RELATION_EVENT_TYPE.UNBLOCK_REQ]: undefined,
			[RELATION_EVENT_TYPE.UNFRIEND_REQ]: undefined,
		};

		const meta = actionsMap[relationEvent];
		if (!meta)
			return ;

		if (meta.useJS)
			await this.js.publish(meta.subject, meta.payload);
		else
			await this.nats.publish(meta.subject, meta.payload);
	}
}

export default RelationsController;
