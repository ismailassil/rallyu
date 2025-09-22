import { MultipartFile } from "@fastify/multipart";
import RelationsRepository from "../repositories/relationsRepository";
import UserRepository from "../repositories/userRepository";
import { FormError, UserAlreadyExistsError, UserNotFoundError } from "../types/auth.types";
import StatsService from "./statsService";
import fs, { createWriteStream } from 'fs';
import { pipeline } from "stream/promises";
import { z } from 'zod';
import MatchesRepository from "../repositories/matchesRepository";
import RelationsService from "./relationsService";

class UserService {
	constructor(
		private userRepository: UserRepository,
		private relationsService: RelationsService,
		private statsService: StatsService,
		private matchesRepository: MatchesRepository
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

	async getUserPublicProfile(viewerID: number, targetUsername: string) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();
		
		const isAllowed = await this.relationsService.canViewUser(viewerID, targetUser.id);
		if (!isAllowed)
			throw new UserNotFoundError();

		const { password: _, ...userWithoutPassword } = targetUser;

		const currentRelationship = await this.relationsService.getRelationBetweenTwoUsers(viewerID, targetUser.id);
		const userRecords = await this.statsService.getUserRecords(targetUser.id);
		const userStats = await this.statsService.getUserStats(targetUser.id, 'all', 'all');
		const { matches: userRecentMatches } = 
			await this.matchesRepository.getMatchesByUser(targetUser.id, 'all', 'all', { page: 1, limit: 10 });
		const userRecentDetailedAnalytics: any[] = await this.statsService.getUserAnalyticsByDay(targetUser.id, 7, 'all');
		const userRecentTimeSpent = userRecentDetailedAnalytics.map((item) => {
			return {
				day: item.day,
				total_duration: item.total_duration
			}
		});

		return {
			user: userWithoutPassword,
			currentRelationship,
			userRecords,
			userStats,
			userRecentMatches,
			userRecentTimeSpent
		};
	}

	async getUserMatches(
		viewerID: number, 
		targetUsername: string, 
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all',
		paginationFilter?: { page: number, limit: number }
	) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAllowed = await this.relationsService.canViewUser(viewerID, targetUser.id);
		if (!isAllowed)
			throw new UserNotFoundError();

		const userMatches = 
			await this.matchesRepository.getMatchesByUser(targetUser.id, timeFilter, gameTypeFilter, paginationFilter);
		
		return userMatches;
	}

	async getUserAnalytics(
		viewerID: number, 
		targetUsername: string, 
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all'
	) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAllowed = await this.relationsService.canViewUser(viewerID, targetUser.id);
		if (!isAllowed)
			throw new UserNotFoundError();

		const userAnalytics = await this.statsService.getUserAnalytics(targetUser.id, timeFilter, gameTypeFilter);
		
		return userAnalytics;
	}
	async getUserAnalyticsByDay(
		viewerID: number, 
		targetUsername: string, 
		daysCount: number = 7,
		gameTypeFilter: 'PING PONG' | 'XO' | 'TICTACTOE' | 'all' = 'all'
	) {
		const targetUser = await this.getUserByUsername(targetUsername);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAllowed = await this.relationsService.canViewUser(viewerID, targetUser.id);
		if (!isAllowed)
			throw new UserNotFoundError();

		const userAnalytics = await this.statsService.getUserAnalyticsByDay(targetUser.id, daysCount, gameTypeFilter);
		
		return userAnalytics;
	}

	async getRankLeaderboard(paginationFilter?: { page: number, limit: number }) {
		return await this.statsService.getRankByXP(paginationFilter);
	}

	/*----------------------------------------------- CREATE -----------------------------------------------*/

	async createUser(
		first_name: string, 
		last_name: string, 
		username: string, 
		email: string, 
		password: string,
		hashedPassword: string
	) {
		this.validateUserCreation(username, password, email, first_name, last_name);

		if (await this.isUsernameTaken(username))
			throw new UserAlreadyExistsError('Username');
		if (await this.isEmailTaken(email))
			throw new UserAlreadyExistsError('Email');

		// CREATE A USER
		const createdUserID = await this.userRepository.create(
			username,
			email,
			first_name,
			last_name,
			hashedPassword
		);

		// CREATE USER STATS
		await this.statsService.createUserRecords(createdUserID);
	}

	// TODO: IMPLEMENT createUserFromOAuth

	/*----------------------------------------------- UPDATE -----------------------------------------------*/

	async updateUser(userID: number, updates: any) {
		const existingUser = await this.userRepository.findById(userID);
		if (!existingUser)
			throw new UserNotFoundError();

		const changes = await this.userRepository.update(userID, updates);
		return changes;
	}

	// TODO: UPDATE AVATAR

	/*----------------------------------------------- DELETE -----------------------------------------------*/
	/*----------------------------------------------- SEARCH -----------------------------------------------*/

	async searchUserByUsername(requesterID: number, targetUsername: string) {
		return await this.userRepository.searchByUsername(requesterID, targetUsername);
	}

	/*----------------------------------------------- CHECKS -----------------------------------------------*/

	async isEmailTaken(email: string) {
		return await this.userRepository.findByEmail(email) != null;
	}
	
	async isUsernameTaken(username: string) {
		return await this.userRepository.findByUsername(username) != null;
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
}

export default UserService;