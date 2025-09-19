import { FastifyInstance } from "fastify";
import UserController from "../controllers/userController";
import RelationsController from "../controllers/userRelationsContoller";
import RelationsRepository from "../repositories/relationsRepository";
import { relationsRequestSchema, userMatchesSchema, userProfileSchema, userUpdateSchema } from "../schemas/users.schema";
import Authenticate from "../middleware/Authenticate";
import fastifyMutipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from "path";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import RelationsService from "../services/relationsService";

async function userRouter(fastify: FastifyInstance) {
	const userRepository = new UserRepository();
	const relationsRepository = new RelationsRepository();

	const relationsService = new RelationsService(userRepository, relationsRepository);
	const userService: UserService = new UserService(userRepository);
	
	const userController: UserController = new UserController(userService);
	const relationsController: RelationsController = new RelationsController(relationsService);

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
		handler: userController.usernameAvailable.bind(userController)
	});
	
	// CHECK IF EMAIL AVAILABLE
	fastify.get('/email-available', {
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
	
	// GET USER FULL STATS
	fastify.get('/:username/full-stats', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.fetchUserFullStats.bind(userController)
	});
	
	// GET USER MATCHES PAGE
	fastify.get('/:username/matches', {
		schema: userMatchesSchema,
		preHandler: fastify.authenticate,
		handler: userController.fetchUserMatchesPage.bind(userController)
	});

	// UPDATE USER AVATAR
	fastify.post('/:username/avatar', {
		preHandler: fastify.authenticate,
		handler: userController.uploadAvatar.bind(userController)
	});

	fastify.get('/search-by-username', {
		preHandler: fastify.authenticate,
		handler: userController.searchUserByUsername.bind(userController)
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