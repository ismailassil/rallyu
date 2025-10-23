import RelationsRepository from "../../repositories/RelationsRepository";
import UserRepository from "../../repositories/UserRepository";
import {
	CannotAcceptRequestError,
	CannotBlockError,
	CannotCancelRequestError,
	CannotRejectRequestError,
	CannotSendFriendRequestError,
	CannotUnblockError,
	NoPendingRequestError,
} from '../../types/exceptions/relations.exceptions';
import { UsersNotFoundError } from "../../types/exceptions/user.exceptions";

class RelationsService {
	constructor(
		private userRepository: UserRepository,
		private relationsRepository: RelationsRepository
	) {}

	/*----------------------------------------------- GETTERS -----------------------------------------------*/
	async getFriends(userID: number) {
		return await this.relationsRepository.findAllFriends(userID);
	}

	async getIncomingFriendRequests(userID: number) {
		return await this.relationsRepository.findIncomingFriendRequests(userID);
	}

	async getOutgoingFriendRequests(userID: number) {
		return await this.relationsRepository.findOutgoingFriendRequests(userID);
	}

	async getIncomingBlocks(userID: number) {
		return await this.relationsRepository.findUsersWhoBlocked(userID);
	}

	async getOutgoingBlocks(userID: number) {
		return await this.relationsRepository.findBlockedUsers(userID);
	}

	async getRelationStatus(userID: number, targetUserID: number) {
		if (userID === targetUserID)
			return null;

		const currentRelationship =
			await this.relationsRepository.findBetweenUsers(userID, targetUserID);
		if (!currentRelationship)
			return 'NONE';

		switch (currentRelationship.relation_status) {
			case 'ACCEPTED':
				return 'FRIENDS';
			case 'PENDING':
				return (currentRelationship.requester_user_id === userID) ? 'OUTGOING' : 'INCOMING';
			default:
				return 'NONE';
		}
	}

	/*----------------------------------------------- REQUESTS -----------------------------------------------*/
	async sendFriendRequest(fromUserID: number, toUserID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(fromUserID),
			this.userRepository.findOne(toUserID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			fromUserID,
			toUserID
		);

		switch (existingTwoWayRelation?.relation_status) {
			case 'ACCEPTED': return 'ALREADY_FRIENDS';
			case 'PENDING': return 'ALREADY_SENT';
			case 'BLOCKED': throw new CannotSendFriendRequestError('Unable to send friend request: user is blocked');
		}

		await this.relationsRepository.create(
			fromUserID,
			toUserID,
			'PENDING'
		);
		return 'CREATED';
	}

	async cancelFriendRequest(fromUserID: number, toUserID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(fromUserID),
			this.userRepository.findOne(toUserID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			fromUserID,
			toUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new NoPendingRequestError('No pending request to this user to cancel');
		else if (existingTwoWayRelation.requester_user_id !== fromUserID)
			throw new CannotCancelRequestError('Only the sender can cancel the request');

		await this.relationsRepository.delete(existingTwoWayRelation.id);
	}

	async acceptFriendRequest(fromUserID: number, toUserID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(fromUserID),
			this.userRepository.findOne(toUserID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			fromUserID,
			toUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new NoPendingRequestError('No pending request from this user to accept');
		if (existingTwoWayRelation.receiver_user_id !== toUserID)
			throw new CannotAcceptRequestError('Only the receiver can accept the request');

		await this.relationsRepository.update(
			existingTwoWayRelation.id,
			'ACCEPTED'
		);
	}

	async rejectFriendRequest(fromUserID: number, toUserID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(fromUserID),
			this.userRepository.findOne(toUserID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			fromUserID,
			toUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new NoPendingRequestError('No pending request from this user to reject');

		if (existingTwoWayRelation.receiver_user_id !== toUserID)
			throw new CannotRejectRequestError('Only the receiver can reject the request');

		await this.relationsRepository.delete(existingTwoWayRelation.id);
	}

	async blockUser(blockerID: number, blockedID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(blockerID),
			this.userRepository.findOne(blockedID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			blockerID,
			blockedID
		);

		if (existingTwoWayRelation?.relation_status === 'BLOCKED' && existingTwoWayRelation.requester_user_id === blockerID)
			return 'ALREADY_BLOCKED';
		if (existingTwoWayRelation?.relation_status === 'BLOCKED' && existingTwoWayRelation.receiver_user_id === blockerID)
			throw new CannotBlockError('User has already blocked you');

		if (existingTwoWayRelation)
			await this.relationsRepository.delete(existingTwoWayRelation.id);

		await this.relationsRepository.create(
			blockerID,
			blockedID,
			'BLOCKED'
		);

		return 'CREATED';
	}

	async unblockUser(unblockerID: number, unblockedID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(unblockerID),
			this.userRepository.findOne(unblockedID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			unblockerID,
			unblockedID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'BLOCKED')
			return 'NOT_BLOCKED';
		if (existingTwoWayRelation.requester_user_id !== unblockerID)
			throw new CannotUnblockError('You can only unblock users you have blocked');

		await this.relationsRepository.delete(existingTwoWayRelation.id);

		return 'DELETED';
	}

	async unfriend(unfrienderUserID: number, unfriendedUserID: number) {
		const [fromUser, toUser] = await Promise.all([
			this.userRepository.findOne(unfrienderUserID),
			this.userRepository.findOne(unfriendedUserID)
		]);

		if (!fromUser || !toUser)
			throw new UsersNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			unfrienderUserID,
			unfriendedUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'ACCEPTED')
			return 'NOT_FRIENDS';

		await this.relationsRepository.delete(existingTwoWayRelation.id);

		return 'DELETED';
	}

	async canViewUser(viewerId: number, targetUserId: number) {
		const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
			viewerId,
			targetUserId
		);

		return !existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'BLOCKED';
	}
}

export default RelationsService;
