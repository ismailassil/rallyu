import { db } from "../../database"
import { InternalServerError } from "../../types/auth.types";

class RelationsRepository {
	constructor() {

	}

	async clean() {
		await db.run(`
			DELETE FROM relations
		`);
	}
	
	async create(requester_id: number, receiver_id: number, relation_status: string) {
		try {
			const runResult = await db.run(
				`INSERT INTO relations (requester_user_id, receiver_user_id, relation_status)
					VALUES (?, ?, ?)`,
			[requester_id, receiver_id, relation_status]);
			return runResult.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findById(id: number) {
		try {
			const relation = await db.get(
				`SELECT * FROM relations WHERE id = ?`,
			[id]);
			return relation ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findTwoWaysByUsers(user_id_a: number, user_id_b: number) : Promise<any | null> {
		try {
			const relation = await db.get(
				`SELECT * FROM relations 
					WHERE (requester_user_id = ? AND receiver_user_id = ?)
					OR (requester_user_id = ? AND receiver_user_id = ?)`,
			[user_id_a, user_id_b, user_id_b, user_id_a]);
			return relation ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findOneWayByUsers(requester_id: number, receiver_id: number) {
		try {
			const relation = await db.get(
				`SELECT * FROM relations 
					WHERE requester_user_id = ? AND receiver_user_id = ?`,
			[requester_id, receiver_id]);
			return relation ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// INCOMING FRIEND REQUESTS
	async findIncomingFriendRequests(user_id: number) {
		try {
			const incomingFriendRequests = await db.all(`
				SELECT users.*, relations.relation_status
					FROM relations
				JOIN users ON relations.requester_user_id = users.id
					WHERE receiver_user_id = ?
					AND relation_status = 'PENDING'`,
			[user_id]);
			return incomingFriendRequests;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
	
	// OUTGOING FRIEND REQUESTS
	async findOutgoingFriendRequests(user_id: number) {
		try {
			const outgoingFriendRequests = await db.all(`
				SELECT users.*, relations.relation_status
					FROM relations
				JOIN users ON relations.receiver_user_id = users.id
					WHERE requester_user_id = ?
					AND relation_status = 'PENDING'`,
			[user_id]);
			return outgoingFriendRequests;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
			
	// BLOCKED USERS (WHO BLOCKED THIS USER)
	async findIncomingBlocks(user_id: number) {
		try {
			const incomingBlocks = await db.all(`
				SELECT users.*, relations.relation_status
					FROM relations
				JOIN users ON relations.requester_user_id = users.id
					WHERE receiver_user_id = ?
					AND relation_status = 'BLOCKED'`,
			[user_id]);
			return incomingBlocks;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// BLOCKED USERS (WHO THIS USER BLOCKED)
	async findOutgoingBlocks(user_id: number) {
		try {
			const outgoingBlocks = await db.all(`
				SELECT users.*, relations.relation_status
					FROM relations
				JOIN users ON relations.receiver_user_id = users.id
					WHERE requester_user_id = ?
					AND relation_status = 'BLOCKED'`,
			[user_id]);
			return outgoingBlocks;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// RELATION BETWEEN TWO USERS (BI-DIRECTION)
	async findRelationStatusByUsers(user_id_a: number, user_id_b: number) : Promise<string> {
		try {
			const relationStatus = await db.get(`
				SELECT relation_status
					FROM relations
				WHERE (requester_user_id = ? AND receiver_user_id = ?)
				OR (requester_user_id = ? AND receiver_user_id = ?)
			`, [user_id_a, user_id_b, user_id_b, user_id_a]);
			return relationStatus ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
	
	// CHECK BLOCK BETWEEN TWO USERS (BI-DIRECTION)
	async findTwoWaysBlockBetweenUsers(user_id_a: number, user_id_b: number) {
		try {
			const relation = await db.get(`
				SELECT *
					FROM relations
				WHERE ((requester_user_id = ? AND receiver_user_id = ?)
				OR (requester_user_id = ? AND receiver_user_id = ?))
				AND relation_status = 'BLOCKED'
			`, [user_id_a, user_id_b, user_id_b, user_id_a]);
			return relation ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	// CHECK BLOCK BETWEEN TWO USERS (UNI-DIRECTION)
	async findOneWayBlockBetweenUsers(blocker_user_id: number, blocked_user_id: number) {
		try {
			const relation = await db.get(`
				SELECT *
					FROM relations
				WHERE (requester_user_id = ? AND receiver_user_id = ?)
				AND relation_status = 'BLOCKED'
			`, [blocker_user_id, blocked_user_id]);
			return relation ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async updateRelationStatus(id: number, status: string) : Promise<boolean> {
		try {
			const runResult = await db.run(`
				UPDATE relations 
				SET relation_status = ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`, [status, id]);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteRelationById(id: number) {
		try {
			const runResult = await db.run(`
				DELETE FROM relations
				WHERE id = ?
			`, [id]);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteOneWayRelationByUsers(requester_id: number, receiver_id: number) {
		try {
			const runResult = await db.run(`
				DELETE FROM relations
				WHERE requester_user_id = ? AND receiver_user_id = ?
			`, [requester_id, receiver_id]);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteTwoWaysRelationByUsers(requester_id: number, receiver_id: number) {
		try {
			const runResult = await db.run(`
				DELETE FROM relations
				WHERE (requester_user_id = ? AND receiver_user_id = ?)
				OR (requester_user_id = ? AND receiver_user_id = ?)
			`, [requester_id, receiver_id, receiver_id, requester_id]);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findAllFriends(user_id: number) {
		try {
			const allFriends = await db.all(`
				SELECT 
					users.id,
					users.username,
					users.first_name,
					users.last_name,
					users.avatar_url,
					relations.relation_status,
					relations.updated_at
				FROM relations
				JOIN users ON (
					(relations.requester_user_id = users.id AND relations.receiver_user_id = ?)
					OR
					(relations.requester_user_id = ? AND relations.receiver_user_id = users.id)
				)
				WHERE relations.relation_status = 'ACCEPTED'
			`, [user_id, user_id]);
			return allFriends;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async countFriends(user_id: number) {
		try {
			const getResult = await db.get(`
				SELECT COUNT(*)
					FROM relations
				WHERE (requester_user_id = ? OR receiver_user_id = ?)
					AND relation_status = 'ACCEPTED'
			`, [user_id, user_id]);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async countIncomingFriendRequests(user_id: number) {
		try {
			const getResult = await db.get(`
				SELECT COUNT(*)
					FROM relations
				WHERE receiver_user_id = ?
					AND relation_status = 'PENDING'
			`, [user_id]);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async countOutgoingFriendRequests(user_id: number) {
		try {
			const getResult = await db.get(`
				SELECT COUNT(*)
					FROM relations
				WHERE requester_user_id = ?
					AND relation_status = 'PENDING'
			`, [user_id]);
			return getResult ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
}

export default RelationsRepository;