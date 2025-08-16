import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import UserController from "../controllers/userController";
import StatsController from "../controllers/statsController";
import RelationsController from "../controllers/userRelationsContoller";
import RelationsRepository from "../repositories/relationsRepository";
import { matchesRequestSchema, relationsRequestSchema, statsRequestSchema, userMatchesSchema, userProfileSchema, userUpdateSchema } from "../schemas/users.schema";
import Authenticate from "../middleware/Authenticate";
import MatchesRepository from "../repositories/matchesRepository";
import fastifyMutipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from "path";
import { IRelationsRequest } from "../types";
import MatchesController from "../controllers/matchesController";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import RelationsService from "../services/relationsService";
import StatsService from "../services/statsService";

async function userRouter(fastify: FastifyInstance) {
	const userRepository = new UserRepository();
	const relationsRepository = new RelationsRepository();

	const relationsService = new RelationsService(relationsRepository);
	const statsService = new StatsService();
	const userService: UserService = new UserService(userRepository, relationsService, statsService);
	relationsService.setUserService(userService);
	
	const userController: UserController = new UserController(userService);
	const relationsController: RelationsController = new RelationsController(relationsService);

	const statsController: StatsController = new StatsController();
	const usersRepo: UserRepository = new UserRepository();
	const relRepo: RelationsRepository = new RelationsRepository();
	const statsRepo: MatchesRepository = new MatchesRepository();
	const matchesController: MatchesController = new MatchesController();

	await fastify.register(fastifyMutipart, {
		limits: {
			files: 1,
			fileSize: 2 * 1024 * 1024,
			fields: 0
		}
	});

	await fastify.register(fastifyStatic, {
		root: path.join(__dirname, '../../','uploads', 'avatars'),
		prefix: '/avatars/'
	});

	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);

	
	/*-------------------------------------------- AVAILABILITY --------------------------------------------*/
	
	// CHECK IF USERNAME AVAILABLE
	fastify.get('/username-available', {
		// preHandler: fastify.authenticate,
		handler: userController.usernameAvailable.bind(userController)
	});
	// CHECK IF EMAIL AVAILABLE
	fastify.get('/email-available', {
		// preHandler: fastify.authenticate,
		handler: userController.emailAvailable.bind(userController)
	});


	/*------------------------------------------------ USERS ------------------------------------------------*/
	// GET USER
	fastify.get('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.fetchUser.bind(userController)
	});
	
	// UPDATE USER (SELF-SERVICE)
	fastify.put('/:username', {
		schema: userUpdateSchema,
		preHandler: fastify.authenticate,
		handler: userController.updateUser.bind(userController)
	});
	
	// DELETE USER (SELF-SERVICE)
	fastify.delete('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.deleteUser.bind(userController)
	});
	
	// GET USER STATS
	fastify.get('/:username/stats', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.fetchUserStats.bind(userController)
	});
	
	// GET USER MATCHES
	fastify.get('/:username/matches', {
		schema: userMatchesSchema,
		preHandler: fastify.authenticate,
		handler: userController.fetchUserMatches.bind(userController)
	});

	// UPDATE USER AVATAR
	fastify.post('/:username/avatar', {
		preHandler: fastify.authenticate,
		handler: userController.uploadAvatar.bind(userController)
	});

	fastify.get('/search-by-username', {
		preHandler: fastify.authenticate,
		handler: userController.searchUser.bind(userController)
	});


	/*-------------------------------------------- USER RELATIONS --------------------------------------------*/
	fastify.get('/friends', {
		preHandler: fastify.authenticate,
		handler: relationsController.fetchFriends.bind(relationsController)
	});
	fastify.get('/blocked', {
		preHandler: fastify.authenticate,
		handler: relationsController.fetchBlocked.bind(relationsController)
	});
	fastify.get('/friends/requests/incoming', {
		preHandler: fastify.authenticate,
		handler: relationsController.fetchIncomingFriendRequests.bind(relationsController)
	});
	fastify.get('/friends/requests/outgoing', {
		preHandler: fastify.authenticate,
		handler: relationsController.fetchOutgoingFriendRequests.bind(relationsController)
	});

	fastify.post('/:user_id/friends/requests', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.sendFriendRequest.bind(relationsController)
	});
	
	fastify.delete('/:user_id/friends/requests', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.cancelFriendRequest.bind(relationsController)
	});
	
	fastify.put('/:user_id/friends/accept', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.acceptFriendRequest.bind(relationsController)
	});
	
	fastify.put('/:user_id/friends/reject', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.rejectFriendRequest.bind(relationsController)
	});
	
	fastify.delete('/:user_id/friends', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.unfriend.bind(relationsController)
	});
	
	fastify.post('/:user_id/block', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.blockUser.bind(relationsController)
	});

	fastify.delete('/:user_id/block', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.unblockUser.bind(relationsController)
	});

	// USER MANAGEMENT (admin or self-service)
	// GET /users — List users (admin only)
	// POST /users — Create user (admin creating users directly)
	// GET /users/:id — Get user by ID
	// PUT /users/:id — Full update of user info
	// PATCH /users/:id — Partial update of user info
	// DELETE /users/:id — Delete user
	
	// POST /reset-password/setup - Reset password (check if a account exists + send OTP to email)
	// POST /reset-password/verify - Check if OTP is valid
	// POST /reset-password/update - Update password
	
	// ACCOUNT MANAGEMENT (self-service)
	// GET /account — Get own profile (alias for /auth/me)
	// PATCH /account — Update own profile
	// DELETE /account — Delete own account (optional)

	/*-------------------------------------------- MATCHES --------------------------------------------*/
	// fastify.get('/match/:id', {
	// 	// preHandler: fastify.authenticate,
	// 	handler: matchesController.getMatch.bind(matchesController)
	// });

	// fastify.post('/match', {
	// 	// preHandler: fastify.authenticate,
	// 	handler: matchesController.newMatch.bind(matchesController)
	// });
}

export default userRouter;