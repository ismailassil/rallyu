import { FastifyInstance } from "fastify";
import UserController from "../controllers/userController";
import RelationsController from "../controllers/relationsContoller";
import Authenticate from "../middleware/Authenticate";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from "path";
import { 
	emailAvailabilitySchema, 
	leaderboardSchema, 
	matchesRequestSchema, 
	relationsRequestSchema, 
	userSearchByUsernameSchema, 
	userUpdateSchema, 
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
		handler: opts.userController.usernameAvailable.bind(opts.userController)
	});
	fastify.get('/email-available', {
		schema: emailAvailabilitySchema,
		handler: opts.userController.emailAvailable.bind(opts.userController)
	});



	/*------------------------------------------------ USERS ------------------------------------------------*/
	fastify.get('/:username', {
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUser.bind(opts.userController)
	});
	fastify.put('/:username', {
		schema: userUpdateSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.updateUser.bind(opts.userController)
	});
	fastify.delete('/:username', {
		preHandler: fastify.authenticate,
		handler: opts.userController.deleteUser.bind(opts.userController)
	});
	
	fastify.get('/leaderboard', {
		schema: leaderboardSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchRankLeaderboard.bind(opts.userController)
	});
	fastify.get('/:username/matches', {
		schema: matchesRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserMatches.bind(opts.userController)
	});
	fastify.get('/:username/analytics', {
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalytics.bind(opts.userController)
	});
	fastify.get('/:username/analytics-by-day', {
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalyticsByDay.bind(opts.userController)
	});

	fastify.post('/:username/avatar', {
		preHandler: fastify.authenticate,
		handler: opts.userController.uploadAvatar.bind(opts.userController)
	});

	fastify.get('/search-by-username', {
		schema: userSearchByUsernameSchema,
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

	fastify.post('/:targetUserId/friends/requests', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.sendFriendRequest.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/friends/requests', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.cancelFriendRequest.bind(opts.relationsController)
	});
	fastify.put('/:targetUserId/friends/accept', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.acceptFriendRequest.bind(opts.relationsController)
	});
	fastify.put('/:targetUserId/friends/reject', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.rejectFriendRequest.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/friends', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.unfriend.bind(opts.relationsController)
	});
	fastify.post('/:targetUserId/block', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.blockUser.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/block', {
		schema: relationsRequestSchema,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.unblockUser.bind(opts.relationsController)
	});
}

export default userRouter;