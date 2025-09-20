import RelationsRepository from "../repositories/relationsRepository";
import UserRepository from "../repositories/userRepository";
import { InternalServerError, UserNotFoundError } from "../types/auth.types";

class RelationsService {
	constructor(
		private userRepository: UserRepository,
		private relationsRepository: RelationsRepository
	) {}

	/*----------------------------------------------- GETTERS -----------------------------------------------*/
	
	// TODO: IMPLEMENT PAGINATION FOR ALL OF THIS
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
		return await this.relationsRepository.findIncomingBlocks(userID);
	}
	
	async getOutgoingBlocks(userID: number) {
		return await this.relationsRepository.findOutgoingBlocks(userID);
	}

	async getRelationBetweenTwoUsers(userID: number, targetUserID: number) {
		if (userID === targetUserID)
			return null;

		const currentRelationship = 
			await this.relationsRepository.findTwoWaysByUsers(userID, targetUserID);
		
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

	// TODO: CLEAN UP THIS MESS | SHOULD WE REMOVE CHECKING FOR USER EXISTENCE? AND ONLY USER RELATIONS?
	// TARGET USER EXISTENCE CHECK IS ONLY NEEDED IN WRITE OPERATIONS SUCH AS SENDING A FRIEND REQUEST
	async sendFriendRequest(fromUserID: number, toUserID: number) {
		const targetUser = await this.userRepository.findById(toUserID);
		if (!targetUser)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			fromUserID,
			toUserID
		);

		if (existingTwoWayRelation) {
			if (existingTwoWayRelation.relation_status === 'BLOCKED')
				throw new Error('UNABLE TO SEND FRIEND REQUEST (BLOCKED)');
			if (existingTwoWayRelation.relation_status === 'PENDING')
				throw new Error('FRIEND REQUEST ALREADY SENT');
			if (existingTwoWayRelation.relation_status === 'ACCEPTED')
				throw new Error('ALREADY FRIENDS');
			else
				throw new Error('AN UNEXPECTED ERROR OCCURED');
		}
		
		const newRelationID = await this.relationsRepository.create(fromUserID, toUserID, 'PENDING');
	}

	async cancelFriendRequest(fromUserID: number, toUserID: number) {
		const targetUser = await this.userRepository.findById(toUserID);
		if (!targetUser)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			fromUserID,
			toUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new Error('NO PENDING REQUEST TO THIS USER TO CANCEL');
		
		if (existingTwoWayRelation.requester_user_id !== fromUserID)
			throw new Error('ONLY THE SENDER CAN CANCEL REQUEST');
		
		await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
	}

	async acceptFriendRequest(fromUserID: number, toUserID: number) {
		const targetUser = await this.userRepository.findById(fromUserID);
		if (!targetUser)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			fromUserID,
			toUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new Error('NO PENDING REQUEST FROM THIS USER TO ACCEPT');
		console.log('accept request');
		console.log(existingTwoWayRelation);
		if (existingTwoWayRelation.receiver_user_id !== toUserID)
			throw new Error('ONLY THE RECEIVER CAN ACCEPT REQUEST');

		const changes = await this.relationsRepository.updateRelationStatus(
			existingTwoWayRelation.id,
			'ACCEPTED'
		);
		if (!changes)
			throw new InternalServerError();

		const updatedRelation = await this.relationsRepository.findById(existingTwoWayRelation.id);
		if (!updatedRelation)
			throw new InternalServerError();

		return updatedRelation;
	}

	async rejectFriendRequest(fromUserID: number, toUserID: number) {
		const targetUser = await this.userRepository.findById(fromUserID);
		if (!targetUser)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			fromUserID,
			toUserID
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new Error('NO PENDING REQUEST FROM THIS USER TO REJECT');
		
		if (existingTwoWayRelation.receiver_user_id !== toUserID)
			throw new Error('ONLY THE RECEIVER CAN REJECT REQUEST');
		
		await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
	}
	
	async blockUser(blockerID: number, blockedID: number) {
		const targetUser = await this.userRepository.findById(blockedID);
		if (!targetUser)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			blockerID,
			blockedID
		);

		if (existingTwoWayRelation && existingTwoWayRelation.relation_status === 'BLOCKED' && existingTwoWayRelation.requester_user_id === blockerID)
			throw new Error('UNABLE TO BLOCK (ALREADY BLOCKED)');
		if (existingTwoWayRelation && existingTwoWayRelation.relation_status === 'BLOCKED' && existingTwoWayRelation.receiver_user_id === blockerID)
			throw new Error('UNABLE TO BLOCK (HE ALREADY BLOCKED YOU)');

		if (existingTwoWayRelation)
			await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
		const newRelationID = await this.relationsRepository.create(
			blockerID,
			blockedID,
			'BLOCKED'
		);
		const newRelation = await this.relationsRepository.findById(newRelationID);
		if (!newRelation)
			throw new InternalServerError();
		return newRelation;
	}

	async unblockUser(unblockerID: number, unblockedID: number) {
		const targetUser = await this.userRepository.findById(unblockedID);
		if (!targetUser)
			throw new UserNotFoundError();

		const existingOneWayRelation = await this.relationsRepository.findOneWayByUsers(
			unblockerID,
			unblockedID
		);

		if (!existingOneWayRelation || existingOneWayRelation.relation_status !== 'BLOCKED')
			throw new Error('UNABLE TO UNBLOCK (NOT BLOCKED)');
		
		await this.relationsRepository.deleteRelationById(existingOneWayRelation.id);
	}
	
	async unfriend(unfrienderUserID: number, unfriendedUserID: number) {
		const targetUser = await this.userRepository.findById(unfriendedUserID);
		if (!targetUser)
			throw new UserNotFoundError();
		
		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			unfrienderUserID,
			unfriendedUserID
		);
		
		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'ACCEPTED')
			throw new Error('UNABLE TO UNFRIEND (NOT FRIENDS)');
		
		await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
	}

	async canViewUser(viewerId: number, targetUserId: number) {
		const isBlocked = await this.relationsRepository.findTwoWaysBlockBetweenUsers(
			viewerId,
			targetUserId
		);

		return !isBlocked;
	}
}

export default RelationsService;