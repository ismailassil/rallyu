import RelationsRepository from "../repositories/relationsRepository";
import UserRepository from "../repositories/userRepository";
import { InternalServerError, UserNotFoundError } from "../types/auth.types";

class RelationsService {
	private relationsRepository: RelationsRepository;
	private userRepository: UserRepository;

	constructor() {
		this.relationsRepository = new RelationsRepository();
		this.userRepository = new UserRepository();
	}

	async sendFriendRequest(sender_id: number, receiver_id: number) {
		const targetExists = await this.userRepository.findById(receiver_id);
		if (!targetExists)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			sender_id,
			receiver_id
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
		
		const newRelationID = await this.relationsRepository.create(sender_id, receiver_id, 'PENDING');
		const newRelation = await this.relationsRepository.findById(newRelationID);
		if (!newRelation)
			throw new InternalServerError();
		return newRelation;
	}

	async cancelFriendRequest(sender_id: number, receiver_id: number) {
		const targetExists = await this.userRepository.findById(receiver_id);
		if (!targetExists)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			sender_id,
			receiver_id
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new Error('NO PENDING REQUEST TO THIS USER TO CANCEL');
		
		if (existingTwoWayRelation.requester_user_id !== sender_id)
			throw new Error('ONLY THE SENDER CAN CANCEL REQUEST');
		
		await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
	}

	async acceptFriendRequest(sender_id: number, receiver_id: number) {
		const targetExists = await this.userRepository.findById(sender_id);
		if (!targetExists)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			sender_id,
			receiver_id
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new Error('NO PENDING REQUEST FROM THIS USER TO ACCEPT');
		console.log('accept request');
		console.log(existingTwoWayRelation);
		if (existingTwoWayRelation.receiver_user_id !== receiver_id)
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

	async rejectFriendRequest(sender_id: number, receiver_id: number) {
		const targetExists = await this.userRepository.findById(sender_id);
		if (!targetExists)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			sender_id,
			receiver_id
		);

		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'PENDING')
			throw new Error('NO PENDING REQUEST FROM THIS USER TO REJECT');
		
		if (existingTwoWayRelation.receiver_user_id !== receiver_id)
			throw new Error('ONLY THE RECEIVER CAN REJECT REQUEST');
		
		await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
	}
	
	async blockUser(blocker_id: number, blocked_id: number) {
		const targetExists = await this.userRepository.findById(blocked_id);
		if (!targetExists)
			throw new UserNotFoundError();

		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			blocker_id,
			blocked_id
		);

		if (existingTwoWayRelation && existingTwoWayRelation.relation_status === 'BLOCKED' && existingTwoWayRelation.requester_user_id === blocker_id)
			throw new Error('UNABLE TO BLOCK (ALREADY BLOCKED)');
		if (existingTwoWayRelation && existingTwoWayRelation.relation_status === 'BLOCKED' && existingTwoWayRelation.receiver_user_id === blocker_id)
			throw new Error('UNABLE TO BLOCK (HE ALREADY BLOCKED YOU)');

		if (existingTwoWayRelation)
			await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
		const newRelationID = await this.relationsRepository.create(
			blocker_id,
			blocked_id,
			'BLOCKED'
		);
		const newRelation = await this.relationsRepository.findById(newRelationID);
		if (!newRelation)
			throw new InternalServerError();
		return newRelation;
	}

	async unblockUser(unblocker_id: number, unblocked_id: number) {
		const targetExists = await this.userRepository.findById(unblocked_id);
		if (!targetExists)
			throw new UserNotFoundError();

		const existingOneWayRelation = await this.relationsRepository.findOneWayByUsers(
			unblocker_id,
			unblocked_id
		);

		if (!existingOneWayRelation || existingOneWayRelation.relation_status !== 'BLOCKED')
			throw new Error('UNABLE TO UNBLOCK (NOT BLOCKED)');
		
		await this.relationsRepository.deleteRelationById(existingOneWayRelation.id);
	}
	
	async unfriend(user_id: number, to_unfriend: number) {
		const existingTwoWayRelation = await this.relationsRepository.findTwoWaysByUsers(
			user_id,
			to_unfriend
		);
		
		if (!existingTwoWayRelation || existingTwoWayRelation.relation_status !== 'ACCEPTED')
			throw new Error('UNABLE TO UNFRIEND (NOT FRIENDS)');
		
		await this.relationsRepository.deleteRelationById(existingTwoWayRelation.id);
	}
}

export default RelationsService;