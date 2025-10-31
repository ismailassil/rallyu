import { MultipartFile } from "@fastify/multipart";
import UserRepository from "../../repositories/UserRepository";
import { UserAlreadyExistsError, UserNotFoundError } from "../../types/exceptions/user.exceptions";
import StatsService from "../GameAndStats/StatsService";
import MatchesRepository from "../../repositories/MatchesRepository";
import RelationsService from "./RelationsService";
import CDNService from "../CDN/CDNService";
import { DatabaseQueryError } from "../../types/exceptions/database.exceptions";
import { nowInMilliseconds } from "../../utils/auth/utils";

class UserService {
	constructor(
		private userRepository: UserRepository,
		private relationsService: RelationsService,
		private statsService: StatsService,
		private matchesRepository: MatchesRepository,
		private cdnService: CDNService
	) {}

	/*----------------------------------------------- GETTERS -----------------------------------------------*/

	async getUserById(userID: number) : Promise<any | null> {
		return await this.userRepository.findOne(userID);
	}

	async getUserByUsername(username: string) : Promise<any | null> {
		return await this.userRepository.findByUsername(username);
	}

	async getUserByEmail(email: string) : Promise<any | null> {
		return await this.userRepository.findByEmail(email);
	}

	async getUserByAuthProvider(authProvider: string, authProviderID: string) {
		return await this.userRepository.findByAuthProvider(authProvider, authProviderID);
	}

	async getUserProfile(viewerID: number, targetUserID?: number, targetUsername?: string) {
		let targetUser = null;

		if (targetUserID)
			targetUser = await this.getUserById(targetUserID);
		else if (targetUsername)
			targetUser = await this.getUserByUsername(targetUsername);

		if (!targetUser)
			throw new UserNotFoundError();

		const isAllowed = await this.relationsService.canViewUser(viewerID, targetUser.id);
		if (!isAllowed)
			throw new UserNotFoundError();

		const { password: _, ...userWithoutPassword } = targetUser;

		const currentRelationship = await this.relationsService.getRelationStatus(viewerID, targetUser.id);
		const userRecords = await this.statsService.getUserRecords(targetUser.id);
		const userStats = await this.statsService.getUserStats(targetUser.id, 'all', 'all');
		const { matches: userRecentMatches } =
			await this.matchesRepository.findAll(targetUser.id, { timeFilter: 'all', gameTypeFilter: 'all', paginationFilter: { page: 1, limit: 10 } });
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
		targetID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all' = 'all',
		paginationFilter?: { page: number, limit: number }
	) {
		const targetUser = await this.getUserById(targetID);
		if (!targetUser)
			throw new UserNotFoundError();

		const isAllowed = await this.relationsService.canViewUser(viewerID, targetUser.id);
		if (!isAllowed)
			throw new UserNotFoundError();

		const userMatches =
			await this.matchesRepository.findAll(targetUser.id, { timeFilter, gameTypeFilter, paginationFilter });

		return userMatches;
	}

	async getUserAnalytics(
		viewerID: number,
		targetID: number,
		timeFilter: '0d' | '1d' | '7d' | '30d' | '90d' | '1y' | 'all' = 'all',
		gameTypeFilter: 'PONG' | 'XO' | 'all' = 'all'
	) {
		const targetUser = await this.getUserById(targetID);
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
		targetID: number,
		daysCount: number = 7,
		gameTypeFilter: 'PONG' | 'XO' | 'all' = 'all'
	) {
		const targetUser = await this.getUserById(targetID);
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
		password: string | null,
		hashedPassword: string | null,
		avatar_url?: string,
		auth_provider?: string,
		auth_provider_id?: string,
		role?: string,
		bio?: string
	) {
		try {
			const createdUserID = await this.userRepository.create(
				username,
				hashedPassword,
				email,
				first_name,
				last_name,
				avatar_url,
				auth_provider,
				auth_provider_id,
				role,
				bio
			);

			return createdUserID;
		} catch (err) {
			if (err instanceof DatabaseQueryError) {
				const parsed = err.details.error;
				if (parsed?.code === 'SQLITE_CONSTRAINT')
					this.throwIfUniqueConstraint(parsed);
			}
			throw err;
		}
	}


	/*----------------------------------------------- UPDATE -----------------------------------------------*/

	async updateUser(userID: number, updates: any) {
		const targetUser = await this.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		try {
			await this.userRepository.update(userID, updates);
		} catch (err) {
			if (err instanceof DatabaseQueryError) {
				const parsed = err.details.error;
				if (parsed?.code === 'SQLITE_CONSTRAINT')
					this.throwIfUniqueConstraint(parsed);
			}
			throw err;
		}
	}

	async anonymizeUser(userID: number) {
		await this.updateUser(userID, this.generateAnonymousUserUpdate());
	}

	/*----------------------------------------------- DELETE -----------------------------------------------*/

	async deleteUser(userID: number) {
		const targetUser = await this.getUserById(userID);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.userRepository.delete(userID);
	}


	/*----------------------------------------------- SEARCH -----------------------------------------------*/

	async searchUsersByQuery(requesterID: number, query: string) {
		return await this.userRepository.search(requesterID, query);
	}

	/*----------------------------------------------- CHECKS -----------------------------------------------*/

	async isEmailTaken(email: string) {
		return await this.getUserByEmail(email) != null;
	}

	async isUsernameTaken(username: string) {
		return await this.getUserByUsername(username) != null;
	}

	async updateAvatar(user_id: number, fileData: MultipartFile) {
		const targetUser = await this.getUserById(user_id);
		if (!targetUser)
			throw new UserNotFoundError();

		await this.userRepository.update(user_id, {
			avatar_url: '/users/avatars/' + (await this.cdnService.storeFromMultipart(fileData)).split('/')[1]
		});
	}

	private throwIfUniqueConstraint(parsed: any) {
		switch (parsed.column) {
			// case 'phone':
			case 'username':
			case 'email':
				throw new UserAlreadyExistsError(parsed.column);
		}
	}

	private generateAnonymousUserUpdate() {
		const currentTimestamp = nowInMilliseconds();

		return {
			first_name: 'Anonymous',
			last_name: 'User',
			username: `anon_${currentTimestamp}`,
			email: `anon_${currentTimestamp}@anonymous.rally.dev`,
			password: null,
			bio: `I am Mr.Robot. Sometimes I dream of saving the world. Saving everyone from the invisible hand, but I'm not that special.`,
			avatar_url: '/users/avatars/mr-robot.png',
			phone: null,
			email_verified: false,
			phone_verified: false,
			auth_provider: 'None',
			auth_provider_id: null,
			role: 'user'
		};
	}
}

export default UserService;
