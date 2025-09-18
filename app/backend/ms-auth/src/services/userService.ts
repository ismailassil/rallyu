import { MultipartFile } from "@fastify/multipart";
import RelationsRepository from "../repositories/relationsRepository";
import UserRepository from "../repositories/userRepository";
import { FormError, UserAlreadyExistsError, UserNotFoundError } from "../types/auth.types";
import StatsService from "./statsService";
import fs, { createWriteStream } from 'fs';
import { pipeline } from "stream/promises";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import RelationsService from "./relationsService";
import fastify from "fastify";

class UserService {
	constructor(
		private userRepository: UserRepository,
		// private relationsService: RelationsService,
		// private statsService: StatsService
	) {}

	/*----------------------------------------------- GETTERS -----------------------------------------------*/

	async getUserById(userID: number) : Promise<any | null> {
		return await this.userRepository.findById(userID);
	}

	async getUserByUsername(username: string) : Promise<any | null> {
		return await this.userRepository.findByUsername(username);
	}

	async getUserByEmail(email: string) : Promise<any | null> {
		return await this.userRepository.findByEmail(email);
	}

	// TODO: USE ID INSTEAD OF USERNAME
	async getUser(requesterID: number, targetUsername: string) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.userRelationCheck(requesterID, targetUser.id);

		return this.extractPublicUserInfo(targetUser); // TODO: SHOULD BE REMOVED
	}

	// USER METRICS (LEVEL/STREAKS/RANK) + USER MATCHES TOTALS (W/L/D)
	async getUserPerformance(requesterID: number, targetUsername: string) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.userRelationCheck(requesterID, targetUser.id);

		return await this.statsService.getUserPerformance(targetUser.id);
	}

	// USER METRICS (LEVEL/STREAKS/RANK) + USER MATCHES TOTALS (W/L/D)
	// async getUserFullStats(requesterID: number, targetUsername: string) {
	// 	const targetUser = await this.getUserByUsername(targetUsername);
	// 	if (!targetUser)
	// 		throw new UserNotFoundError();

	// 	await this.userRelationCheck(requesterID, targetUser.id);

	// 	return await this.statsService.getUserSummaryStats(targetUser.id);
	// }

	async getUserMatchesPage(requesterID: number, targetUsername: string, page: number) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.userRelationCheck(requesterID, targetUser.id);

		return await this.statsService.getUserMatches(targetUser.id, page);
	}

	// TODO: USE ID INSTEAD OF USERNAME
	// TODO: SHOULD THIS FUNCTION BE ONLY TAKING TARGET? THE LOGIC OF RELATION BETWEEN USERS CHECK SHOULD BE OUTSIDE?
	// async getUserFullInfo(requesterID: number, targetUsername: string) {
	// 	const targetUser = await this.getUserByUsername(targetUsername);
	// 	if (!targetUser)
	// 		throw new UserNotFoundError();
		
	// 	// RELATION CHECK
	// 	await this.userRelationCheck(requesterID, targetUser.id);

	// 	const currentRelation = (requesterID === targetUser.id) ? null : await this.relationsService.getRelationship(requesterID, targetUser.id);

	// 	const statsSummary = await this.statsService.getUserStatsSummary(targetUser.id); // TODO: REVIEW THIS

	// 	const recentMatches = await this.statsService.getUserRecentMatches(targetUser.id); // TODO: REVIEW THIS

	// 	return {
	// 		user: this.extractPublicUserInfo(targetUser), // TODO: REMOVE THIS
	// 		friendship_status: currentRelation, // TODO: RENAME THIS IN BOTH BACKEND AND FRONTEND
	// 		stats: {
	// 			user: statsSummary.user_stats,
	// 			matches: statsSummary.matches_stats
	// 		},
	// 		matches: recentMatches
	// 	}
	// }

	// getAllUsers (Pagination) admin-only


	/*----------------------------------------------- CREATE -----------------------------------------------*/

	async createUser(first_name: string, last_name: string, username: string, email: string, password: string) {
		this.validateUserCreation(username, password, email, first_name, last_name);

		// CHECK IF USER WITH CREDENTIALS EXISTS
		if (await this.isCredentialsTaken(username, email))
			throw new UserAlreadyExistsError('Username/Email');

		const bcryptRounds = 12; // TODO: INJECT CONFIGURATION
		const hashedPassword = await bcrypt.hash(password!, bcryptRounds); // TODO: PASSWORD HASHER

		const createdUserID = await this.userRepository.create(
			username,
			email,
			first_name,
			last_name,
			'/avatars/default.png',
			'local',
			hashedPassword
		);

		// TODO: CREATE USER STATS
		// TODO: WHAT SHOULD IT RETURN
		return createdUserID;
	}

	// TODO: IMPLEMENT createUserFromOAuth

	/*----------------------------------------------- UPDATE -----------------------------------------------*/

	async updateUser(userID: number, updates: any) {
		this.userExistsCheck(userID);

		const changes = await this.userRepository.update(userID, updates);
		return changes;
	}

	// async updateUserPassword(userID: number, newPassword: string) {
	// 	this.validateUserExists(userID);

	// 	const bcryptRounds = 12; // TODO: INJECT CONFIGURATION
	// 	const newHashedPassword = await bcrypt.hash(newPassword!, bcryptRounds); // TODO: PASSWORDHASHER

	// 	const changes = await this.updateUser(userID, { password: newHashedPassword });
	// 	return changes;
	// }

	// TODO: UPDATE AVATAR

	/*----------------------------------------------- DELETE -----------------------------------------------*/
	/*----------------------------------------------- SEARCH -----------------------------------------------*/

	async searchUserByUsername(requesterID: number, targetUsername: string) {
		return await this.userRepository.searchByUsername(requesterID, targetUsername);
	}

	/*----------------------------------------------- CHECKS -----------------------------------------------*/
	
	async isCredentialsTaken(username: string, email: string) {
		// TODO: CAN BE OPTIMIZED USING ONE SQL QUERY
		return (await this.isEmailTaken(email) && await this.isUsernameTaken(username));
	}

	async isEmailTaken(email: string) {
		return await this.userRepository.findByEmail(email) != null;
	}
	
	async isUsernameTaken(username: string) {
		return await this.userRepository.findByUsername(username) != null;
	}

	async userRelationCheck(requesterID: number, targetID: number) {
		if (await this.relationsService.isBlocked(targetID, requesterID))
			throw new UserNotFoundError();
	}

	async userExistsCheck(userID: number) {
		const existingUser = await this.userRepository.findById(userID);
		if (!existingUser)
			throw new UserNotFoundError();
	}

	/*----------------------------------------------- VALIDATION -----------------------------------------------*/

	private validateUserCreation(username: string, password: string, email: string, first_name: string, last_name: string) {
		const userCreationSchema = z.object({
			first_name: z.string()
				.min(2, "First name must be at least 2 characters")
				.max(10, "First name must be at most 10 characters")
				.regex(/^[A-Za-z]+$/, "First name must contain only letters"),
			
			last_name: z.string()
				.min(2, "Last name must be at least 2 characters")
				.max(10, "Last name must be at most 10 characters")
				.regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
			
			username: z.string()
				.min(3, "Username must be at least 3 characters")
				.max(50, "Username must be at least 50 characters")
				.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
		  
			email: z.string()
				.email("Invalid email address"),
		  
			password: z.string()
				.min(8, "Password must be at least 8 characters")
				.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
				.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
				.regex(/(?=.*\d)/, "Password must contain a digit")
		});

		const validationResult = userCreationSchema.safeParse({ first_name, last_name, username, password, email });
		if (!validationResult.success) {
			const errors = validationResult.error.flatten();
			throw new FormError(undefined, errors.fieldErrors);
		}
	}

	async updateAvatar(user_id: number, fileData: MultipartFile) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		const allowedMimeTypes = ['images/jpg', 'image/jpeg', 'image/png'];
		if (!allowedMimeTypes.includes(fileData.mimetype))
			throw new Error('File type not allowed'); // need to change it to custom error class

		const fileExtension = fileData.mimetype.split('/')[1];
		const fileName = `${existingUser.username}.${fileExtension}`;
		const uploadDir = `./uploads/avatars`;
		
		if (!fs.existsSync(uploadDir))
			fs.mkdirSync(uploadDir, { recursive: true });

		const filepath = uploadDir + '/' + fileName;

		await pipeline(fileData.file, createWriteStream(filepath));

		await this.userRepository.updateAvatar(user_id, `/avatars/${fileName}`);

		return `/avatars/${fileName}`;

		// try {
		// 	await pipeline(fileData.file, createWriteStream(filepath));

		// 	await this.userRepository.updateAvatar(user_id, fileName);

		// 	return `/avatars/${fileName}`;
		// } catch (err: any) {
		// 	try {
		// 		await fs.unlink(filepath, (err) => { if (err) throw err } ); // need to check this
		// 	} catch {}

		// 	throw err;
		// }
	}

	private extractPublicUserInfo(privateUserInfo: any) {
		const publicUserInfo = {
			id: privateUserInfo.id,
			first_name: privateUserInfo.first_name,
			last_name: privateUserInfo.last_name,
			email: privateUserInfo.email,
			username: privateUserInfo.username,
			bio: privateUserInfo.bio,
			avatar_path: privateUserInfo.avatar_path,
			role: privateUserInfo.role
		}

		return publicUserInfo;
	}

	// private extractPublicRelation(user_id: number, relation: any) {
	// 	if (relation && relation.relation_status === 'BLOCKED')
	// 		throw new UserNotFoundError();

	// 	let friendship_status = 'NONE';
	// 	if (relation && relation.relation_status === 'ACCEPTED')
	// 		friendship_status = 'FRIENDS';
	// 	if (relation && relation.relation_status === 'PENDING')
	// 		friendship_status = (relation.requester_user_id === user_id) ? 'OUTGOING' : 'INCOMING';

	// 	return friendship_status;
	// }

	// async getUsername(user_id: number) {
	// 	const existingUser = await this.userRepository.findById(user_id);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	return existingUser.username;
	// }

	// async getAvatar(user_id: number) {
	// 	const existingUser = await this.userRepository.findById(user_id);
	// 	if (!existingUser)
	// 		throw new UserNotFoundError();

	// 	return existingUser.avatar_path;
	// }
}

export default UserService;