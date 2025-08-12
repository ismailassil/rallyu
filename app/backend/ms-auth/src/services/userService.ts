import { MultipartFile } from "@fastify/multipart";
import RelationsRepository from "../repositories/relationsRepository";
import UserRepository from "../repositories/userRepository";
import { UserNotFoundError } from "../types/auth.types";
import StatsService from "./statsService";
import fs, { createWriteStream } from 'fs';
import { pipeline } from "stream/promises";

class UserService {
	private userRepository: UserRepository;
	private relationsRepository: RelationsRepository;
	private statsService: StatsService;

	constructor() {
		this.userRepository = new UserRepository();
		this.relationsRepository = new RelationsRepository();
		this.statsService = new StatsService();
	}
	
	async fetchMe(user_id: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		return this.extractPublicUserInfo(existingUser);
		// const relation = await this.relationsRepository.findTwoWaysByUsers(user_id, existingUser.id);
		// const friendship_status = this.extractPublicRelation(user_id, relation);

		// const statsSummary = await this.statsService.getUserStatsSummary(existingUser.id);

		// const recentMatches = await this.statsService.getUserRecentMatches(existingUser.id);

		// return {
		// 	user: this.extractPublicUserInfo(existingUser),
		// 	friendship_status: null,
		// 	stats: {
		// 		user: statsSummary.user_stats,
		// 		matches: statsSummary.matches_stats
		// 	},
		// 	matches: recentMatches
		// }
	}

	async getUser(user_id: number, username: string) {
		const existingUser = await this.userRepository.findByUsername(username);
		if (!existingUser)
			throw new UserNotFoundError();

		const relation = user_id === existingUser.id ? null : await this.relationsRepository.findTwoWaysByUsers(user_id, existingUser.id);
		const friendship_status = user_id === existingUser.id ? null : this.extractPublicRelation(user_id, relation);

		const statsSummary = await this.statsService.getUserStatsSummary(existingUser.id);

		const recentMatches = await this.statsService.getUserRecentMatches(existingUser.id);

		return {
			user: this.extractPublicUserInfo(existingUser),
			friendship_status,
			stats: {
				user: statsSummary.user_stats,
				matches: statsSummary.matches_stats
			},
			matches: recentMatches
		}
	}

	async getUserStats(user_id: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		return await this.statsService.getUserStats(user_id);
	}

	async getUserMatches(user_id: number, page: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		return await this.statsService.getUserMatches(user_id, page);
	}

	async updateUser(user_id: number, updates: any) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		const changes = await this.userRepository.update(user_id, updates);
		// if (!changes)
		// 	throw new UserNotFoundError();

		const newUser = await this.userRepository.findById(user_id);
		if (!newUser)
			throw new UserNotFoundError();
		return newUser;
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

	private extractPublicRelation(user_id: number, relation: any) {
		if (relation && relation.relation_status === 'BLOCKED')
			throw new UserNotFoundError();

		let friendship_status = 'NONE';
		if (relation && relation.relation_status === 'ACCEPTED')
			friendship_status = 'FRIENDS';
		if (relation && relation.relation_status === 'PENDING')
			friendship_status = (relation.requester_user_id === user_id) ? 'OUTGOING' : 'INCOMING';

		return friendship_status;
	}

	async getUsername(user_id: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		return existingUser.username;
	}

	async getAvatar(user_id: number) {
		const existingUser = await this.userRepository.findById(user_id);
		if (!existingUser)
			throw new UserNotFoundError();

		return existingUser.avatar_path;
	}
}

export default UserService;