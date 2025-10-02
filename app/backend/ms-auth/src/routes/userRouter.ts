import { FastifyInstance } from "fastify";
import UserController from "../controllers/UserController";
import RelationsController from "../controllers/RelationsContoller";
import Authenticate from "../middleware/Authenticate";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from "path";
import { 
	emailAvailabilitySchema, 
	leaderboardSchema, 
	matchesRequestSchema, 
	relationsRequestSchema, 
	userIdSchema, 
	userSearchByUsernameSchema, 
	userUpdateSchema, 
	userUsernameSchema, 
	usernameAvailabilitySchema 
} from "../schemas/users.schema";

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
		schema: usernameAvailabilitySchema,
		handler: opts.userController.usernameAvailableHandler.bind(opts.userController)
	});
	fastify.get('/email-available', {
		schema: emailAvailabilitySchema,
		handler: opts.userController.emailAvailableHandler.bind(opts.userController)
	});



	/*------------------------------------------------ USERS ------------------------------------------------*/
	fastify.get('/', {
		schema: userUsernameSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserByUsernameQueryHandler.bind(opts.userController)
	});
	fastify.get('/:id', {
		schema: userIdSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserHandler.bind(opts.userController)
	});
	fastify.put('/:id', {
		schema: userUpdateSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.updateUserHandler.bind(opts.userController)
	});
	fastify.delete('/:id', {
		schema: userIdSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.deleteUserHandler.bind(opts.userController)
	});
	
	fastify.get('/leaderboard', {
		schema: leaderboardSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchRankLeaderboardHandler.bind(opts.userController)
	});
	fastify.get('/:id/matches', {
		schema: matchesRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserMatchesHandler.bind(opts.userController)
	});
	fastify.get('/:id/analytics', {
		schema: userIdSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalyticsHandler.bind(opts.userController)
	});
	fastify.get('/:id/analytics-by-day', {
		schema: userIdSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalyticsByDayHandler.bind(opts.userController)
	});

	fastify.post('/:id/avatar', {
		schema: userIdSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.uploadAvatarHandler.bind(opts.userController)
	});

	fastify.get('/search-by-username', {
		schema: userSearchByUsernameSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.searchUserByUsernameHandler.bind(opts.userController)
	});



	/*-------------------------------------------- USER RELATIONS --------------------------------------------*/
	fastify.get('/friends', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchFriendsHandler.bind(opts.relationsController)
	});
	fastify.get('/blocked', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchBlockedHandler.bind(opts.relationsController)
	});
	fastify.get('/friends/requests/incoming', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchIncomingFriendRequestsHandler.bind(opts.relationsController)
	});
	fastify.get('/friends/requests/outgoing', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchOutgoingFriendRequestsHandler.bind(opts.relationsController)
	});

	fastify.post('/:targetUserId/friends/requests', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.sendFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/friends/requests', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.cancelFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.put('/:targetUserId/friends/accept', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.acceptFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.put('/:targetUserId/friends/reject', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.rejectFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/friends', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.unfriendHandler.bind(opts.relationsController)
	});
	fastify.post('/:targetUserId/block', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.blockUserHandler.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/block', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.unblockUserHandler.bind(opts.relationsController)
	});
}

export default userRouter;