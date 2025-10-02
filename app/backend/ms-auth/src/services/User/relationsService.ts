// import RelationsRepository from "../repositories/relationsRepository";
import RelationsRepository from "../../repositories/RelationsRepository";
import UserRepository from "../../repositories/userRepository";
import { AlreadyFriendsError, CannotAcceptRequestError, CannotBlockError, CannotCancelRequestError, CannotRejectRequestError, CannotSendFriendRequestError, CannotUnfriendError, FriendRequestAlreadySentError, InternalServerError, NoPendingRequestError, UserNotFoundError, UsersNotFoundError } from "../../types/auth.types";

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
		try {
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

			if (existingTwoWayRelation) {
				if (existingTwoWayRelation.relation_status === 'BLOCKED')
					throw new CannotSendFriendRequestError('Cannot send friend request: user is blocked')
				if (existingTwoWayRelation.relation_status === 'PENDING')
					throw new FriendRequestAlreadySentError();
				if (existingTwoWayRelation.relation_status === 'ACCEPTED')
					throw new AlreadyFriendsError();
			}

			await this.relationsRepository.create(fromUserID, toUserID, 'PENDING');
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof CannotSendFriendRequestError ||
				err instanceof FriendRequestAlreadySentError ||
				err instanceof AlreadyFriendsError) {
				throw err;
			}
			throw new InternalServerError('Failed to send friend request');
		}
	}

	async cancelFriendRequest(fromUserID: number, toUserID: number) {
		try {
			const [fromUser, targetUser] = await Promise.all([
				this.userRepository.findOne(fromUserID),
				this.userRepository.findOne(toUserID)
			]);
	
			if (!fromUser || !targetUser)
				throw new UsersNotFoundError();
	
			const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
				fromUserID,
				toUserID
			);
	
			if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
				throw new NoPendingRequestError('No pending request to this user to cancel');
			
			if (existingTwoWayRelation.requester_user_id !== fromUserID)
				throw new CannotCancelRequestError('Only the sender can cancel the request');
			
			await this.relationsRepository.delete(existingTwoWayRelation.id);
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof NoPendingRequestError ||
				err instanceof CannotCancelRequestError) {
				throw err;
			}
			throw new InternalServerError('Failed to cancel friend request');
		}
	}

	async acceptFriendRequest(fromUserID: number, toUserID: number) {
		try {
			const [fromUser, targetUser] = await Promise.all([
				this.userRepository.findOne(fromUserID),
				this.userRepository.findOne(toUserID)
			]);
	
			if (!fromUser || !targetUser)
				throw new UsersNotFoundError();
	
			const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
				fromUserID,
				toUserID
			);

			if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
				throw new NoPendingRequestError('No pending request from this user to accept');
			if (existingTwoWayRelation.receiver_user_id !== toUserID)
				throw new CannotAcceptRequestError('Only the receiver can accept the request');

			await this.relationsRepository.update(existingTwoWayRelation.id, 'ACCEPTED');
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof NoPendingRequestError ||
				err instanceof CannotAcceptRequestError) {
				throw err;
			}
			throw new InternalServerError('Failed to accept friend request');
		}
	}

	async rejectFriendRequest(fromUserID: number, toUserID: number) {
		try {
			const [fromUser, targetUser] = await Promise.all([
				this.userRepository.findOne(fromUserID),
				this.userRepository.findOne(toUserID)
			]);
	
			if (!fromUser || !targetUser)
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
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof NoPendingRequestError ||
				err instanceof CannotRejectRequestError) {
				throw err;
			}
			throw new InternalServerError('Failed to reject friend request');
		}
	}
	
	async blockUser(blockerID: number, blockedID: number) {
		try {
			const [fromUser, targetUser] = await Promise.all([
				this.userRepository.findOne(blockerID),
				this.userRepository.findOne(blockedID)
			]);

			if (!fromUser || !targetUser)
				throw new UsersNotFoundError();

			const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
				blockerID,
				blockedID
			);

			if (existingTwoWayRelation && existingTwoWayRelation.relation_status === 'BLOCKED' && existingTwoWayRelation.requester_user_id === blockerID)
				throw new CannotBlockError('User is already blocked');
			if (existingTwoWayRelation && existingTwoWayRelation.relation_status === 'BLOCKED' && existingTwoWayRelation.receiver_user_id === blockerID)
				throw new CannotBlockError('User has already blocked you');

			if (existingTwoWayRelation)
				await this.relationsRepository.delete(existingTwoWayRelation.id);

			await this.relationsRepository.create(blockerID, blockedID, 'BLOCKED');
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof CannotBlockError) {
				throw err;
			}
			throw new InternalServerError('Failed to block user');
		}
	}

	async unblockUser(unblockerID: number, unblockedID: number) {
		try {
			const [fromUser, targetUser] = await Promise.all([
				this.userRepository.findOne(unblockerID),
				this.userRepository.findOne(unblockedID)
			]);

			if (!fromUser || !targetUser)
				throw new UsersNotFoundError();

			const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
				unblockerID,
				unblockedID
			);

			if (!existingTwoWayRelation)
				throw new CannotBlockError('User is not blocked');
			if (existingTwoWayRelation.relation_status !== 'BLOCKED')
				throw new CannotBlockError('User is not blocked');
			if (existingTwoWayRelation.requester_user_id !== unblockerID)
				throw new CannotBlockError('You can only unblock users you have blocked');

			await this.relationsRepository.delete(existingTwoWayRelation.id);
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof CannotBlockError) {
				throw err;
			}
			throw new InternalServerError('Failed to unblock user');
		}
	}
	
	async unfriend(unfrienderUserID: number, unfriendedUserID: number) {
		try {
			const [fromUser, targetUser] = await Promise.all([
				this.userRepository.findOne(unfrienderUserID),
				this.userRepository.findOne(unfriendedUserID)
			]);

			if (!fromUser || !targetUser)
				throw new UsersNotFoundError();

			const existingTwoWayRelation = await this.relationsRepository.findBetweenUsers(
				unfrienderUserID,
				unfriendedUserID
			);

			if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'ACCEPTED')
				throw new CannotUnfriendError('User is not your friend');

			await this.relationsRepository.delete(existingTwoWayRelation.id);
		} catch (err) {
			if (err instanceof UsersNotFoundError ||
				err instanceof CannotUnfriendError) {
				throw err;
			}
			throw new InternalServerError('Failed to unfriend user');
		}
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