import { db } from "../database";
import ARepository from "./ARepository";

interface Relation {
	id: number;
	requester_user_id: number;
	receiver_user_id: number;
	relation_status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
	created_at: number;
	updated_at: number;
}

class RelationsRepository extends ARepository {

	/**
	 * Find a relation by its ID.
	 * @param id - ID of the relation.
	 * @returns The relation object if found, otherwise null.
	 */
	async findOne(id: number) : Promise<Relation | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM relations WHERE id = ?`,
				[id]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding relation by ID');
		}
		return null;
	}

	/**
	 * Find a relation between two users.
	 * @param userAID - ID of the first user.
	 * @param userBID - ID of the second user.
	 * @returns The relation object if found, otherwise null.
	 */
	async findBetweenUsers(userAID: number, userBID: number) : Promise<Relation | null> {
		try {
			const getResult = await db.get(
				`SELECT * FROM relations 
					WHERE (requester_user_id = ? AND receiver_user_id = ?) 
					OR (requester_user_id = ? AND receiver_user_id = ?)`,
				[userAID, userBID, userBID, userAID]
			);
			return getResult ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding relation between users');
		}
		return null;
	}

	/**
	 * Find all friends of a user.
	 * @param userID - ID of the user.
	 * @returns An array of relations representing the user's friends.
	 */
	async findAllFriends(userID: number) {
		try {
			const allFriends = await db.all(`
				SELECT 
					users.id,
					users.username,
					users.first_name,
					users.last_name,
					users.avatar_url,
					relations.relation_status,
					relations.created_at,
					relations.updated_at
				FROM relations
				JOIN users ON (
					(relations.requester_user_id = users.id AND relations.receiver_user_id = ?)
					OR
					(relations.requester_user_id = ? AND relations.receiver_user_id = users.id)
				)
				WHERE relations.relation_status = 'ACCEPTED'
			`, [userID, userID]);
			return allFriends;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding all friends of user');
		}
		return [];
	}

	/**
	 * Find all incoming friend requests for a user.
	 * @param userID - ID of the user.
	 * @returns An array of relations representing incoming friend requests.
	 */
	async findIncomingFriendRequests(userID: number) {
		try {
			const incomingFriendRequests = await db.all(`
				SELECT 
					users.id,
					users.username,
					users.first_name,
					users.last_name,
					users.avatar_url,
					relations.relation_status,
					relations.created_at,
					relations.updated_at
				FROM relations
				JOIN users ON relations.requester_user_id = users.id
				WHERE relations.receiver_user_id = ?
					AND relations.relation_status = 'PENDING'
			`, [userID]);
			return incomingFriendRequests;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding incoming friend requests for user');
		}
		return [];
	}

	/**
	 * Find all outgoing friend requests from a user.
	 * @param userID - ID of the user.
	 * @returns An array of relations representing outgoing friend requests.
	 */
	async findOutgoingFriendRequests(userID: number) {
		try {
			const outgoingFriendRequests = await db.all(`
				SELECT 
					users.id,
					users.username,
					users.first_name,
					users.last_name,
					users.avatar_url,
					relations.relation_status,
					relations.created_at,
					relations.updated_at
				FROM relations
				JOIN users ON relations.receiver_user_id = users.id
				WHERE relations.requester_user_id = ?
					AND relations.relation_status = 'PENDING'
			`, [userID]);
			return outgoingFriendRequests;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding outgoing friend requests for user');
		}
		return [];
	}

	/**
	 * Find all blocked users by a user.
	 * @param userID - ID of the user.
	 * @returns An array of relations representing blocked users.
	 */
	async findBlockedUsers(userID: number) {
		try {
			const outgoingBlocks = await db.all(`
				SELECT 
					users.id,
					users.username,
					users.first_name,
					users.last_name,
					users.avatar_url,
					relations.relation_status,
					relations.created_at,
					relations.updated_at
				FROM relations
				JOIN users ON relations.receiver_user_id = users.id
				WHERE relations.requester_user_id = ?
					AND relations.relation_status = 'BLOCKED'
			`, [userID]);
			return outgoingBlocks;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding blocked users by user');
		}
		return [];
	}

	/**
	 * Find all users who have blocked a user.
	 * @param userID - ID of the user.
	 * @returns An array of relations representing users who have blocked the user.
	 */
	async findUsersWhoBlocked(userID: number) {
		try {
			const incomingBlocks = await db.all(`
				SELECT 
					users.id,
					users.username,
					users.first_name,
					users.last_name,
					users.avatar_url,
					relations.relation_status,
					relations.created_at,
					relations.updated_at
				FROM relations
				JOIN users ON relations.requester_user_id = users.id
				WHERE relations.receiver_user_id = ?
					AND relations.relation_status = 'BLOCKED'
			`, [userID]);
			return incomingBlocks;
		} catch (err: any) {
			this.handleDatabaseError(err, 'finding users who have blocked user');
		}
		return [];
	}

	/**
	 * Create a new relation between two users.
	 * @param requesterID - ID of the user sending the request.
	 * @param receiverID - ID of the user receiving the request.
	 * @param status - Status of the relation ('PENDING', 'ACCEPTED', 'BLOCKED').
	 * @returns The ID of the newly created relation.
	 */
	async create(requesterID: number, receiverID: number, status: 'PENDING' | 'ACCEPTED' | 'BLOCKED') : Promise<number | null> {
		try {
			const runResult = await db.run(
				`INSERT INTO relations (requester_user_id, receiver_user_id, relation_status) 
					VALUES (?, ?, ?)`,
				[requesterID, receiverID, status]
			);
			return runResult.lastID ?? null;
		} catch (err: any) {
			this.handleDatabaseError(err, 'creating new relation');
		}
		return null;
	}

	/**
	 * Update the status of a relation between two users.
	 * @param id - ID of the relation to update.
	 * @param status - New status of the relation ('PENDING', 'ACCEPTED', 'BLOCKED').
	 * @returns True if the relation was updated, otherwise false.
	 */
	async update(id: number, status: 'PENDING' | 'ACCEPTED' | 'BLOCKED') : Promise<boolean> {
		try {
			const runResult = await db.run(`
				UPDATE relations
				SET relation_status = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`, [status, id]);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'updating relation status');
		}
		return false;
	}

	/**
	 * Delete a relation by its ID.
	 * @param id - ID of the relation to delete.
	 * @returns True if the relation was deleted, otherwise false.
	 */
	async delete(id: number) : Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM relations WHERE id = ?`,
				[id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting relation by ID');
		}
		return false;
	}

	/**
	 * Delete a relation between two users.
	 * @param userAID - ID of the first user.
	 * @param userBID - ID of the second user.
	 * @returns True if the relation was deleted, otherwise false.
	 */
	async deleteBetweenUsers(userAID: number, userBID: number) : Promise<boolean> {
		try {
			const runResult = await db.run(
				`DELETE FROM relations 
					WHERE (requester_user_id = ? AND receiver_user_id = ?) 
					OR (requester_user_id = ? AND receiver_user_id = ?)`,
				[userAID, userBID, userBID, userAID]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			this.handleDatabaseError(err, 'deleting relation between users');
		}
		return false;
	}
}

export default RelationsRepository;