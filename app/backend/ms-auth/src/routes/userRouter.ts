import { FastifyInstance } from "fastify";
import UserController from "../controllers/userController";
import RelationsController from "../controllers/relationsContoller";
import RelationsRepository from "../repositories/relationsRepository";
import { relationsRequestSchema, userMatchesSchema, userProfileSchema, userUpdateSchema } from "../schemas/users.schema";
import Authenticate from "../middleware/Authenticate";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from "path";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import RelationsService from "../services/relationsService";

async function userRouter(fastify: FastifyInstance, opts: { userController: UserController, relationsController: RelationsController }) {

	await fastify.register(fastifyMultipart, {
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

	fastify.get('/username-available', {
		handler: opts.userController.usernameAvailable.bind(opts.userController)
	});
	fastify.get('/email-available', {
		handler: opts.userController.emailAvailable.bind(opts.userController)
	});


	/*------------------------------------------------ USERS ------------------------------------------------*/

	fastify.get('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUser.bind(opts.userController)
	});
	fastify.put('/:username', {
		schema: userUpdateSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.updateUser.bind(opts.userController)
	});
	fastify.delete('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.deleteUser.bind(opts.userController)
	});
	
	fastify.get('/:username/matches', {
		// schema: userMatchesSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserMatches.bind(opts.userController)
	});
	fastify.get('/:username/analytics', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalytics.bind(opts.userController)
	});
	fastify.get('/:username/analytics-by-day', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalyticsByDay.bind(opts.userController)
	});


	fastify.post('/:username/avatar', {
		preHandler: fastify.authenticate,
		handler: opts.userController.uploadAvatar.bind(opts.userController)
	});

	fastify.get('/search-by-username', {
		preHandler: fastify.authenticate,
		handler: opts.userController.searchUserByUsername.bind(opts.userController)
	});


	/*-------------------------------------------- USER RELATIONS --------------------------------------------*/

	fastify.get('/friends', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchFriends.bind(opts.relationsController)
	});
	fastify.get('/blocked', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchBlocked.bind(opts.relationsController)
	});
	fastify.get('/friends/requests/incoming', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchIncomingFriendRequests.bind(opts.relationsController)
	});
	fastify.get('/friends/requests/outgoing', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchOutgoingFriendRequests.bind(opts.relationsController)
	});

	fastify.post('/:user_id/friends/requests', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.sendFriendRequest.bind(opts.relationsController)
	});
	fastify.delete('/:user_id/friends/requests', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.cancelFriendRequest.bind(opts.relationsController)
	});
	fastify.put('/:user_id/friends/accept', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.acceptFriendRequest.bind(opts.relationsController)
	});
	fastify.put('/:user_id/friends/reject', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.rejectFriendRequest.bind(opts.relationsController)
	});
	fastify.delete('/:user_id/friends', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.unfriend.bind(opts.relationsController)
	});
	fastify.post('/:user_id/block', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.blockUser.bind(opts.relationsController)
	});
	fastify.delete('/:user_id/block', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: opts.relationsController.unblockUser.bind(opts.relationsController)
	});
}

export default userRouter;